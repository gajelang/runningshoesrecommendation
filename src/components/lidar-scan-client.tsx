"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type ScanStatus = "checking" | "unsupported" | "ready" | "scanning" | "captured" | "error";

interface DepthMetrics {
  min: number;
  max: number;
  mean: number;
  width: number;
  height: number;
}

const STORAGE_KEY = "stridefit-depth-map";

function getXRSystem(): any | null {
  if (typeof window === "undefined") {
    return null;
  }
  return (navigator as any).xr ?? null;
}

export function LiDARScanClient() {
  const [status, setStatus] = useState<ScanStatus>("checking");
  const [message, setMessage] = useState<string | null>(null);
  const [depthPreview, setDepthPreview] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DepthMetrics | null>(null);

  const sessionRef = useRef<any>(null);
  const referenceSpaceRef = useRef<any>(null);
  const frameHandleRef = useRef<number | null>(null);
  const latestDepthRef = useRef<any>(null);

  useEffect(() => {
    let canceled = false;

    const detectSupport = async () => {
      const xr = getXRSystem();
      if (!xr) {
        if (!canceled) {
          setStatus("unsupported");
          setMessage("Browser does not expose WebXR. Use Safari on iPhone/iPad Pro with LiDAR.");
        }
        return;
      }

      try {
        const supported = await xr.isSessionSupported("immersive-ar");
        if (!supported) {
          setStatus("unsupported");
          setMessage("This device/browser cannot start an immersive AR session.");
          return;
        }
        setStatus("ready");
        setMessage("Ready to connect. Find a flat surface and tap Start LiDAR Capture.");
      } catch (error) {
        console.error("[lidar] isSessionSupported failed", error);
        if (!canceled) {
          setStatus("unsupported");
          setMessage("Unable to verify LiDAR availability.");
        }
      }
    };

    detectSupport();

    return () => {
      canceled = true;
    };
  }, []);

  const cleanupSession = useCallback(async () => {
    if (frameHandleRef.current !== null && sessionRef.current) {
      sessionRef.current.cancelAnimationFrame(frameHandleRef.current);
      frameHandleRef.current = null;
    }

    if (sessionRef.current) {
      try {
        await sessionRef.current.end();
      } catch (error) {
        console.warn("[lidar] Unable to end XR session", error);
      }
      sessionRef.current = null;
    }

    referenceSpaceRef.current = null;
    latestDepthRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      void cleanupSession();
    };
  }, [cleanupSession]);

  const captureDepthFrame = useCallback(async () => {
    const depthInfo: any | null = latestDepthRef.current;

    if (!depthInfo) {
      setMessage("Depth data not ready yet. Move the device slowly and try again.");
      return;
    }

    try {
      const width: number = depthInfo.width;
      const height: number = depthInfo.height;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to create 2D canvas context.");
      }

      const image = ctx.createImageData(width, height);
      const data = image.data;

      let min = Number.POSITIVE_INFINITY;
      let max = 0;
      let sum = 0;
      let count = 0;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const depthMeters = depthInfo.getDepthInMeters
            ? depthInfo.getDepthInMeters(x, y)
            : depthInfo.data
              ? depthInfo.data[y * width + x]
              : 0;

          if (depthMeters && Number.isFinite(depthMeters) && depthMeters > 0) {
            min = Math.min(min, depthMeters);
            max = Math.max(max, depthMeters);
            sum += depthMeters;
            count += 1;
          }
        }
      }

      if (!count || !Number.isFinite(min) || !Number.isFinite(max)) {
        throw new Error("Captured frame does not contain valid depth values.");
      }

      const range = max - min || 1;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const depthMeters = depthInfo.getDepthInMeters
            ? depthInfo.getDepthInMeters(x, y)
            : depthInfo.data
              ? depthInfo.data[y * width + x]
              : 0;

          const normalized = depthMeters && depthMeters > 0 ? (depthMeters - min) / range : 0;
          // invert so closer areas appear brighter
          const intensity = 255 - Math.min(255, Math.max(0, Math.round(normalized * 255)));
          const idx = (y * width + x) * 4;
          data[idx] = intensity;
          data[idx + 1] = intensity;
          data[idx + 2] = intensity;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");

      const mean = sum / count;
      const depthMetrics: DepthMetrics = {
        min: Number(min.toFixed(3)),
        max: Number(max.toFixed(3)),
        mean: Number(mean.toFixed(3)),
        width,
        height,
      };

      setDepthPreview(dataUrl);
      setMetrics(depthMetrics);
      setStatus("captured");
      setMessage("Depth map captured. Continue to Analysis to attach it automatically.");

      const payload = {
        dataUrl,
        metrics: depthMetrics,
        capturedAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }

      await cleanupSession();
    } catch (error) {
      console.error("[lidar] Unable to capture depth frame", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to process depth data.");
    }
  }, [cleanupSession]);

  const startScan = useCallback(async () => {
    const xr = getXRSystem();
    if (!xr) {
      setStatus("unsupported");
      setMessage("WebXR is not available in this browser.");
      return;
    }

    setStatus("scanning");
    setMessage("Initializing LiDAR session...");

    try {
      const sessionInit = {
        requiredFeatures: ["local"],
        optionalFeatures: ["depth-sensing"],
        depthSensing: {
          usagePreference: ["cpu-optimized"],
          dataFormatPreference: ["luminance-alpha", "float32"],
        },
      };

      const session = await xr.requestSession("immersive-ar", sessionInit);
      sessionRef.current = session;

      const referenceSpace = await session.requestReferenceSpace("local");
      referenceSpaceRef.current = referenceSpace;

      setMessage("Move around the foot until the capture button is enabled.");

      const onXRFrame = (_time: number, frame: any) => {
        const refSpace = referenceSpaceRef.current;
        if (!refSpace) {
          return;
        }

        const pose = frame.getViewerPose(refSpace);
        if (pose && pose.views.length > 0) {
          const view = pose.views[0];
          try {
            const depthInfo = frame.getDepthInformation(view);
            if (depthInfo) {
              latestDepthRef.current = depthInfo;
            }
          } catch (error) {
            console.warn("[lidar] getDepthInformation failed", error);
          }
        }

        frameHandleRef.current = session.requestAnimationFrame(onXRFrame);
      };

      frameHandleRef.current = session.requestAnimationFrame(onXRFrame);
    } catch (error) {
      console.error("[lidar] Unable to start session", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to start LiDAR session.");
      await cleanupSession();
    }
  }, [cleanupSession]);

  const resetCapture = () => {
    setDepthPreview(null);
    setMetrics(null);
    setStatus("ready");
    setMessage("Ready to connect. Find a flat surface and tap Start LiDAR Capture.");
    latestDepthRef.current = null;
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-secondary/20 p-6">
        <h2 className="text-2xl font-semibold">Capture Footprint with LiDAR</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Gunakan iPhone/iPad Pro dengan LiDAR (Safari 17+) untuk membuat depth map telapak kaki. Depth map akan
          disimpan otomatis dan dihubungkan ke halaman analisis.
        </p>
      </section>

      <div className="space-y-4 rounded-xl border border-border bg-secondary/30 p-6">
        <p className="text-sm text-muted-foreground">
          Status:{" "}
          <span className="font-medium text-foreground">
            {status === "checking" && "Memeriksa dukungan LiDAR..."}
            {status === "unsupported" && "Perangkat tidak mendukung WebXR Depth."}
            {status === "ready" && "Siap untuk memulai."}
            {status === "scanning" && "Sedang menangkap depth frame..."}
            {status === "captured" && "Depth map berhasil disimpan."}
            {status === "error" && "Terjadi kesalahan."}
          </span>
        </p>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void startScan()}
            disabled={!(status === "ready")}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start LiDAR Capture
          </button>

          <button
            type="button"
            onClick={() => void captureDepthFrame()}
            disabled={!(status === "scanning")}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Capture Depth Map
          </button>

          <button
            type="button"
            onClick={resetCapture}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            disabled={status !== "captured"}
          >
            Reset
          </button>
        </div>
      </div>

      {depthPreview ? (
        <section className="grid gap-4 rounded-xl border border-border bg-secondary/30 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h3 className="text-lg font-semibold">Depth Map Preview</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Depth map sudah disimpan di perangkat ini. Lanjutkan ke halaman Analisis untuk otomatis melampirkannya ke
              form upload.
            </p>
            {metrics ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div>
                  <dt className="font-medium text-foreground">Ukuran</dt>
                  <dd>
                    {metrics.width} × {metrics.height}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Kedalaman (m)</dt>
                  <dd>
                    min {metrics.min} · max {metrics.max} · mean {metrics.mean}
                  </dd>
                </div>
              </dl>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Buka Form Analisis
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (!depthPreview) return;
                  const link = document.createElement("a");
                  link.href = depthPreview;
                  link.download = `lidar-depth-${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Unduh PNG
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src={depthPreview}
              alt="Depth map preview"
              className="h-full w-full rounded-md object-contain"
            />
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </section>
      ) : null}

      {status === "unsupported" ? (
        <section className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
          Perangkat ini belum mendukung WebXR Depth Sensing. Kamu tetap dapat mengambil foto footprint manual dan
          mengunggah depth map (PNG) secara manual di halaman Analisis.
        </section>
      ) : null}
    </div>
  );
}

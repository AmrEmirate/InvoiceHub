"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/lib/types";

function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user: User = JSON.parse(decodeURIComponent(userParam));

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login with Google successful!");
        router.push("/dashboard");
      } catch (error) {
        toast.error("Failed to process Google login.");
        router.push("/login");
      }
    } else {
      toast.error("Google login failed. No token provided.");
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-xl font-medium text-neutral-700">
        Processing your login...
      </div>
      <p className="text-neutral-500 mt-2">
        Please wait, you are being redirected.
      </p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallback />
    </Suspense>
  );
}

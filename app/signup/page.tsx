import React, { Suspense } from "react";
import SignUpClient from "./SignUpClient"

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <Suspense fallback={<div />}>
      <SignUpClient />
    </Suspense>
  );
}
"use client";

import React, { Suspense } from "react";
import PaymentConfirmation from "./PaymentConfirmation";

export const dynamic = "force-dynamic";

export default function PaymentConfirmationPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentConfirmation />
    </Suspense>
  );
}

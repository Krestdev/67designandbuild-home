import React from "react";
import { AxiosError } from "axios";
import { NotFoundError } from "@/components/errors/not-found-error";
import { MaintenanceError } from "@/components/errors/maintenance-error";
import { GeneralError } from "@/components/errors/general-error";
import { BadRequest } from "@/components/errors/badRequest";

function FetchError({ error }: { error: Error | null }) {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return <NotFoundError />;
    }
    if (error.response?.status === 500) {
      return <GeneralError />;
    }
    if (error.response?.status === 503) {
      return <MaintenanceError />;
    }
  }
  return <BadRequest />;
}

export default FetchError;

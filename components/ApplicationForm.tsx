"use client";
import { useState, FormEvent } from "react";
import type { Career } from "@/hooks/career/type";
import { submitApplication } from "@/hooks/application/applicationQuery";
import { useLocaleStore } from "@/store/locale-store";

const inputClass =
  "w-full min-h-[40px] bg-[#FFF0DF] border border-[#EDD3B7] px-3 py-1.5 text-base text-[#212121] placeholder:text-[#AFAFAF] focus:outline-none focus:border-[#D97B2C]";

const labelClass = "text-sm font-medium text-[#212121] mb-2 block";

const CV_MAX_BYTES = 10 * 1024 * 1024;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

/**
 * Single application form under the job list. `jobId` is controlled by the
 * page so the "Apply" buttons can preselect a job; "" = spontaneous application.
 */
export function ApplicationForm({
  jobs,
  jobId,
  onJobChange,
}: {
  jobs: Career[];
  jobId: string;
  onJobChange: (jobId: string) => void;
}) {
  const { locale, t } = useLocaleStore();
  const [form, setForm] = useState<FormState>(initialForm);
  const [cv, setCv] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > CV_MAX_BYTES) {
      setStatus("error");
      setErrorMessage(t("cvTooLarge"));
      return;
    }
    setStatus("idle");
    setErrorMessage(null);
    setCv(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cv) {
      setStatus("error");
      setErrorMessage(t("cvRequired"));
      return;
    }
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await submitApplication(
        {
          career: jobId ? Number(jobId) : undefined,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          message: form.message || undefined,
        },
        cv,
        // Language of the acknowledgment email sent to the applicant
        locale,
      );

      setStatus("success");
      setForm(initialForm);
      setCv(null);
    } catch (err) {
      console.error("Application submission failed:", err);
      setStatus("error");
      setErrorMessage(t("submitError"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>
            {t("fullName")} <span className="text-[#D97B2C]">*</span>
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder={t("fullNamePlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            {t("email")} <span className="text-[#D97B2C]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder={t("emailPlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            {t("phoneLabel")} <span className="text-[#D97B2C]">*</span>
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="+237 6..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            {t("positionLabel")} <span className="text-[#D97B2C]">*</span>
          </label>
          <select
            value={jobId}
            onChange={(e) => onJobChange(e.target.value)}
            className={inputClass}
          >
            <option value="">{t("spontaneousApplication")}</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          {t("cvLabel")} <span className="text-[#D97B2C]">*</span>
        </label>
        {cv ? (
          <div className="flex items-center justify-between text-sm text-[#212121] bg-white/50 px-3 py-2">
            <span className="truncate">{cv.name}</span>
            <button
              type="button"
              onClick={() => setCv(null)}
              className="text-[#D97B2C] ml-2 shrink-0"
            >
              {t("remove")}
            </button>
          </div>
        ) : (
          <label className="block border border-dashed border-[#AFAFAF] bg-[#FBF3EA] px-4 py-6 text-center cursor-pointer">
            <span className="text-[#D97B2C] font-medium underline">
              {t("attachClick")}
            </span>
            <p className="text-xs text-[#AFAFAF] mt-1">{t("cvHint")}</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("messageLabel")}</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder={t("messagePlaceholder")}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start bg-[#D97B2C] text-[#212121] px-4 py-1 h-[52px] flex items-center text-sm leading-none font-medium disabled:opacity-50"
      >
        {status === "submitting" ? t("submitting") : t("applySubmit")}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-700">{t("applySuccess")}</p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-sm text-red-700">{errorMessage}</p>
      )}

      <p className="text-xs text-[#333333] italic">{t("privacyNote")}</p>
    </form>
  );
}

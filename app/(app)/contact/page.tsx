"use client";
import { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { contactQuery } from "@/hooks/contact/contactQuery";
import type { ContactGlobal } from "@/hooks/contact/type";
import { serviceListQuery } from "@/hooks/service/serviceListQuery";
import type { Service } from "@/hooks/service/type";
// ASSUMPTION: mirrors serviceListQuery/type naming — confirm these exist
// at this path, or adjust the import if your Sector hook is named
// differently.
import { sectorListQuery } from "@/hooks/sector/sectorListQuery";
import type { Sector } from "@/hooks/sector/type";
import { quoteRequestQuery } from "@/hooks/quoteRequest/quoteRequestQuery";
import { uploadMedia } from "@/lib/uploadMedia";
import { useLocale } from "@/providers/localeProvider";

function ContactContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

const inputClass =
  "w-full min-h-[40px] bg-[#FFF0DF] border border-[#EDD3B7] px-3 py-1.5 text-base text-[#212121] placeholder:text-[#AFAFAF] focus:outline-none focus:border-[#D97B2C]";

const labelClass = "text-sm font-medium text-[#212121] mb-2 block";

type FormState = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  sector: string;
  location: string;
  timeline: string;
  budget: string;
  description: string;
};

const initialForm: FormState = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  projectType: "",
  sector: "",
  location: "",
  timeline: "",
  budget: "",
  description: "",
};

export default function ContactPage() {
  const { locale, t } = useLocale();

  const { data, isLoading, error } = useQuery<ContactGlobal>({
    queryKey: ["contact", locale],
    queryFn: () => contactQuery.getBlobal({ locale }),
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["services-options", locale],
    queryFn: () => serviceListQuery.get({ locale }),
  });

  const { data: sectors } = useQuery<Sector[]>({
    queryKey: ["sectors-options", locale],
    queryFn: () => sectorListQuery.get({ locale }),
  });

  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isLoading || error || !data) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const tooLarge = selected.filter((f) => f.size > 20 * 1024 * 1024);
    if (tooLarge.length > 0) {
      setErrorMessage(t("fileTooLarge"));
      return;
    }
    setErrorMessage(null);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const attachmentIds = await Promise.all(files.map((file) => uploadMedia(file)));

      await quoteRequestQuery.post({
        fullName: form.fullName,
        company: form.company || undefined,
        email: form.email,
        phone: form.phone,
        projectType: Number(form.projectType),
        sector: form.sector ? Number(form.sector) : undefined,
        location: form.location,
        timeline: form.timeline || undefined,
        budget: form.budget || undefined,
        description: form.description,
        attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
      });

      setStatus("success");
      setForm(initialForm);
      setFiles([]);
    } catch (err) {
      console.error("Quote request submission failed:", err);
      setStatus("error");
      setErrorMessage(t("submitError"));
    }
  };

  const mapSrc =
    data.mapLatitude != null && data.mapLongitude != null
      ? `https://www.google.com/maps?q=${data.mapLatitude},${data.mapLongitude}&z=16&output=embed`
      : null;

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="bg-[#212121] py-16 md:py-[120px]">
        <ContactContainer>
          <div className="flex flex-col gap-3 items-center text-center max-w-[720px] mx-auto">
            <h1 className="font-semibold text-4xl md:text-[60px] leading-[1.1] tracking-[-0.025em] text-white">
              {data.heroTitle}
            </h1>
            <p className="text-base leading-[1.5] text-[#AFAFAF]">
              {data.heroSubtitle}
            </p>
          </div>
        </ContactContainer>
      </section>

      {/* ---- FORM + COORDONNÉES ---- */}
      <section className="bg-[#FBF3EA] py-16 md:py-[120px]">
        <ContactContainer>
          <div className="flex flex-col md:grid md:grid-cols-[1fr_400px] gap-12">
            {/* Coordonnées + Map — first on mobile, right column on desktop */}
            <div className="flex flex-col gap-6 order-1 md:order-2">
              <div className="border border-[#D97B2C] p-6 flex flex-col gap-6">
                <div>
                  <h2 className="font-semibold text-2xl leading-[1.1] text-[#212121] mb-1">
                    {data.coordonneesTitle}
                  </h2>
                  <p className="text-sm leading-[1.5] text-[#5B5B5B]">
                    {data.coordonneesSubtitle}
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-[#21212114]">
                  <div className="py-3 first:pt-0">
                    <p className="text-xs uppercase text-[#AFAFAF] mb-1">{t("addressLabel")}</p>
                    <p className="text-base font-medium text-[#212121]">{data.address}</p>
                  </div>
                  <div className="py-3">
                    <p className="text-xs uppercase text-[#AFAFAF] mb-1">{t("phoneLabel")}</p>
                    <p className="text-base font-medium text-[#212121]">{data.phone}</p>
                  </div>
                  <div className="py-3">
                    <p className="text-xs uppercase text-[#AFAFAF] mb-1">{t("emailAddressLabel")}</p>
                    <p className="text-base font-medium text-[#212121]">{data.email}</p>
                  </div>
                  <div className="py-3 last:pb-0">
                    <p className="text-xs uppercase text-[#AFAFAF] mb-1">{t("hoursLabel")}</p>
                    <p className="text-base font-medium text-[#212121]">{data.hours}</p>
                  </div>
                </div>
              </div>

              {mapSrc ? (
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <iframe
                    src={mapSrc}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t("mapIframeTitle")}
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[4/3] bg-[#E5E5E5] flex items-center justify-center text-sm text-[#5B5B5B]">
                  {t("mapMissing")}
                </div>
              )}
            </div>

            {/* Quote Request Form */}
            <div className="order-2 md:order-1">
              <h2 className="font-semibold text-2xl leading-[1.1] text-[#212121] mb-1">
                {t("quoteTitle")}
              </h2>
              <p className="text-sm leading-[1.5] text-[#5B5B5B] mb-6">
                {t("quoteSubtitle")}
              </p>

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
                    <label className={labelClass}>{t("company")}</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder={t("companyPlaceholder")}
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
                      {t("projectType")} <span className="text-[#D97B2C]">*</span>
                    </label>
                    <select
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      {services?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t("sector")}</label>
                    <select
                      name="sector"
                      value={form.sector}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">{t("selectPlaceholder")}</option>
                      {sectors?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      {t("location")} <span className="text-[#D97B2C]">*</span>
                    </label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      placeholder={t("locationPlaceholder")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("timeline")}</label>
                    <input
                      name="timeline"
                      value={form.timeline}
                      onChange={handleChange}
                      placeholder={t("timelinePlaceholder")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t("budget")}</label>
                  <div className="flex items-center min-h-[40px] border border-[#EDD3B7] bg-[#FFF0DF] focus-within:border-[#D97B2C]">
                    <input
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder={t("budgetPlaceholder")}
                      className="w-full bg-transparent px-3 py-1.5 text-base text-[#212121] placeholder:text-[#AFAFAF] focus:outline-none"
                    />
                    <span className="pr-3 text-sm text-[#5B5B5B]">FCFA</span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    {t("description")} <span className="text-[#D97B2C]">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder={t("descriptionPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t("attachmentsLabel")}</label>
                  <label className="block border border-dashed border-[#AFAFAF] bg-[#FBF3EA] px-4 py-6 text-center cursor-pointer">
                    <span className="text-[#D97B2C] font-medium underline">
                      {t("attachClick")}
                    </span>{" "}
                    <span className="text-sm text-[#5B5B5B]">{t("attachDrop")}</span>
                    <p className="text-xs text-[#AFAFAF] mt-1">
                      {t("attachHint")}
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.dwg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {files.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1">
                      {files.map((file, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm text-[#212121] bg-white/50 px-3 py-2"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-[#D97B2C] ml-2 shrink-0"
                          >
                            {t("remove")}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="self-start bg-[#D97B2C] text-[#212121] px-4 py-1 h-[52px] flex items-center text-sm leading-none font-medium disabled:opacity-50"
                >
                  {status === "submitting" ? t("submitting") : t("submitCta")}
                </button>

                {status === "success" && (
                  <p className="text-sm text-green-700">
                    {t("submitSuccess")}
                  </p>
                )}
                {status === "error" && errorMessage && (
                  <p className="text-sm text-red-700">{errorMessage}</p>
                )}

                <p className="text-xs text-[#333333] italic">
                  {t("privacyNote")}
                </p>
              </form>
            </div>
          </div>
        </ContactContainer>
      </section>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { enquirySchema } from "@/lib/utils/validation";
import { submitEnquiry } from "@/actions/enquiries";

export default function ContactForm({
  defaultTopic = "General Enquiry",
  showBookingFields = false,
}) {
  const [serverState, setServerState] = useState({ status: "idle", message: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: defaultTopic,
      message: "",
      event_date: "",
      guest_count: "",
      website: "",
    },
  });

  async function onSubmit(values) {
    setServerState({ status: "idle", message: "" });
    const res = await submitEnquiry(values);
    if (res.ok) {
      setServerState({ status: "success", message: res.message });
      reset({ ...values, name: "", email: "", phone: "", message: "" });
    } else {
      setServerState({ status: "error", message: res.error });
    }
  }

  if (serverState.status === "success") {
    return (
      <div className="py-10 text-center space-y-4">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="font-display text-3xl font-semibold text-brown">
          Thank you for reaching out
        </h3>
        <p className="font-sans text-sm text-brown/75 max-w-md mx-auto">
          {serverState.message}
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setServerState({ status: "idle", message: "" })}
          >
            Send Another Enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot anti-spam field */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />

      {serverState.status === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-terracotta/40 bg-terracotta/10 p-4 text-sm text-brown">
          <AlertCircle className="h-5 w-5 text-terracotta shrink-0 mt-0.5" />
          <p>{serverState.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="enquiry-name"
            className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-2"
          >
            Your Name *
          </label>
          <input
            id="enquiry-name"
            type="text"
            placeholder="Amaya Perera"
            {...register("name")}
            className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown placeholder:text-brown/40 focus:border-primary focus:outline-none"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-terracotta">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-email"
            className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-2"
          >
            Email Address *
          </label>
          <input
            id="enquiry-email"
            type="email"
            placeholder="amaya@example.com"
            {...register("email")}
            className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown placeholder:text-brown/40 focus:border-primary focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-terracotta">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="enquiry-phone"
            className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-2"
          >
            Phone / WhatsApp
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            placeholder="077 XXX XXXX"
            {...register("phone")}
            className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown placeholder:text-brown/40 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="enquiry-topic"
            className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-2"
          >
            Enquiry Type *
          </label>
          <select
            id="enquiry-topic"
            {...register("topic")}
            className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown focus:border-primary focus:outline-none"
          >
            <option value="General Enquiry">General Enquiry</option>
            <option value="Space Booking">Space Booking / Group Table</option>
            <option value="Event Registration">Event Registration / Question</option>
            <option value="Community Collaboration">Community Collaboration</option>
          </select>
        </div>
      </div>

      {showBookingFields && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="enquiry-date"
              className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-2"
            >
              Preferred Date
            </label>
            <input
              id="enquiry-date"
              type="date"
              {...register("event_date")}
              className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="enquiry-guests"
              className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-2"
            >
              Estimated Guests
            </label>
            <input
              id="enquiry-guests"
              type="text"
              placeholder="e.g. 12–15 people"
              {...register("guest_count")}
              className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown placeholder:text-brown/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="enquiry-message"
          className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-2"
        >
          Message *
        </label>
        <textarea
          id="enquiry-message"
          rows={4}
          placeholder="Tell us about your visit, gathering, or question..."
          {...register("message")}
          className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown placeholder:text-brown/40 focus:border-primary focus:outline-none resize-y"
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-terracotta">{errors.message.message}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <p className="font-sans text-xs text-brown/65">
          Need an immediate reply? Message us on{" "}
          <a
            href="https://wa.me/94772201989"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2"
          >
            WhatsApp
          </a>
          .
        </p>
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Sending..." : "Send Enquiry"}
        </Button>
      </div>
    </form>
  );
}

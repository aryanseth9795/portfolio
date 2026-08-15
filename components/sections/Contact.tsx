"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MapPin,
  Mail,
  Linkedin,
  Github,
  CheckCircle,
} from "lucide-react";
import { personalInfo } from "@/lib/data";
import { fadeInUp } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: 4,
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(255, 215, 0, 0.12)"}`,
    background: "rgba(17, 17, 25, 0.8)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    letterSpacing: "0.02em",
  });

  const socials = [
    {
      icon: Mail,
      href: `mailto:${personalInfo.email}`,
      label: personalInfo.email,
    },
    { icon: Github, href: personalInfo.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: MapPin, href: "#", label: personalInfo.location },
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle
          title="Establish Comms"
          subtitle="Open a secure channel. Let's build something remarkable."
        />

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3
              className="text-xl font-bold mb-6 tracking-wider"
              style={{ fontFamily: "var(--font-display)", fontSize: 16 }}
            >
              Let&apos;s engineer something{" "}
              <span className="gradient-text">remarkable</span> together.
            </h3>

            <p
              className="mb-8 leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Currently accepting new missions and collaborations. Whether you
              have a project proposal, a question, or just want to establish
              contact — the comms channel is open.
            </p>

            <div className="space-y-4">
              {socials.map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={
                    href.startsWith("mailto") || href === "#"
                      ? undefined
                      : "_blank"
                  }
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 group"
                  style={{
                    border: "1px solid transparent",
                  }}
                  variants={fadeInUp}
                  custom={i}
                  whileHover={{
                    borderColor: "rgba(255, 215, 0, 0.15)",
                    background: "rgba(255, 215, 0, 0.03)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(255, 215, 0, 0.06)",
                      border: "1px solid rgba(255, 215, 0, 0.12)",
                    }}
                  >
                    <Icon size={18} style={{ color: "var(--accent-gold)" }} />
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass hud-corners p-8 rounded-2xl text-center h-full flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <CheckCircle
                    size={48}
                    style={{ color: "var(--accent-gold)" }}
                  />
                </motion.div>
                <h4
                  className="text-lg font-bold mt-4 mb-2 tracking-wider"
                  style={{ fontFamily: "var(--font-display)", fontSize: 14 }}
                >
                  Transmission Sent
                </h4>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  Message received. I&apos;ll respond to your transmission shortly.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass hud-corners p-6 md:p-8 rounded-2xl space-y-5"
              >
                {(["name", "email", "subject"] as const).map((field, i) => (
                  <motion.div key={field} variants={fadeInUp} custom={i}>
                    <input
                      type={field === "email" ? "email" : "text"}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255, 215, 0, 0.4)";
                        e.currentTarget.style.boxShadow =
                          "0 0 10px rgba(255, 215, 0, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors[field]
                          ? "#ef4444"
                          : "rgba(255, 215, 0, 0.12)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      style={inputStyle(field)}
                      aria-label={field}
                    />
                    {errors[field] && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-1 ml-1"
                        style={{ color: "#ef4444" }}
                      >
                        {errors[field]}
                      </motion.p>
                    )}
                  </motion.div>
                ))}

                <motion.div variants={fadeInUp} custom={3}>
                  <textarea
                    placeholder="Message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255, 215, 0, 0.4)";
                      e.currentTarget.style.boxShadow =
                        "0 0 10px rgba(255, 215, 0, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.message
                        ? "#ef4444"
                        : "rgba(255, 215, 0, 0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={{
                      ...inputStyle("message"),
                      resize: "vertical" as const,
                    }}
                    aria-label="Message"
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-1 ml-1"
                      style={{ color: "#ef4444" }}
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </motion.div>

                <MagneticButton
                  onClick={() => {}}
                  style={{
                    background: "var(--gradient-main)",
                    border: "none",
                    color: "#0a0a0f",
                    fontWeight: 700,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {sending ? (
                    <div
                      className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{
                        borderColor: "#0a0a0f",
                        borderTopColor: "transparent",
                      }}
                    />
                  ) : (
                    <>
                      Transmit <Send size={16} />
                    </>
                  )}
                </MagneticButton>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="text-center mt-20 pb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          Designed & Engineered at{" "}
          <span className="gradient-text font-semibold">STARK.OS Labs</span> ©{" "}
          {new Date().getFullYear()}
        </p>
      </motion.footer>
    </section>
  );
}

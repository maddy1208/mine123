import React, { useState, useEffect, useRef } from "react";

const SignupFlow = () => {
  // State management
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpTimerRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    otpVerified: false,
    businessName: "",
    gst: "",
    address: "",
    idProof: null,
    aadhaar: "",
    pan: "",
    landProof: null,
    selfie: null,
    farmLocation: "",
    crops: [],
    bankAcc: "",
    ifsc: "",
  });

  // Toast notification system
  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white font-medium z-50 animate-fade-in-up shadow-lg ${
      type === "error"
        ? "bg-red-600"
        : type === "success"
          ? "bg-green-600"
          : "bg-[#1a4a2e]"
    }`;
    toast.innerHTML = `<i class="fas ${type === "error" ? "fa-exclamation-circle" : type === "success" ? "fa-check-circle" : "fa-info-circle"} mr-2"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Update steps based on role
  useEffect(() => {
    if (selectedRole === "buyer") {
      setSteps([
        { title: "Basic Info", id: "buyerBasic" },
        { title: "Verify Phone", id: "buyerOtp" },
        { title: "Business & ID", id: "buyerBusiness" },
        { title: "Review", id: "buyerReview" },
      ]);
    } else if (selectedRole === "farmer") {
      setSteps([
        { title: "Identity", id: "farmerIdentity" },
        { title: "Verify Phone", id: "farmerOtp" },
        { title: "Govt ID & Selfie", id: "farmerDocs" },
        { title: "Farm & Bank", id: "farmerFarm" },
        { title: "Review", id: "farmerReview" },
      ]);
    }
    setCurrentStep(0);
  }, [selectedRole]);

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = () => {
    const stepId = steps[currentStep]?.id;

    if (selectedRole === "buyer") {
      if (stepId === "buyerBasic") {
        if (!formData.fullName || !formData.email || !formData.password) {
          showToast("Please fill all required fields", "error");
          return false;
        }
        if (formData.password.length < 6) {
          showToast("Password must be at least 6 characters", "error");
          return false;
        }
        return true;
      }
      if (stepId === "buyerOtp") {
        if (!formData.otpVerified) {
          showToast("Please verify your phone number with OTP", "error");
          return false;
        }
        return true;
      }
      return true;
    } else {
      if (stepId === "farmerIdentity") {
        if (!formData.fullName || !formData.email || !formData.password) {
          showToast("Please fill all identity fields", "error");
          return false;
        }
        if (formData.password.length < 6) {
          showToast("Password must be at least 6 characters", "error");
          return false;
        }
        return true;
      }
      if (stepId === "farmerOtp") {
        if (!formData.otpVerified) {
          showToast("Please verify your phone number with OTP", "error");
          return false;
        }
        return true;
      }
      if (stepId === "farmerDocs") {
        if (!formData.landProof) {
          showToast("Please upload land ownership proof", "error");
          return false;
        }
        if (!formData.selfie) {
          showToast("Please capture a live selfie", "error");
          return false;
        }
        return true;
      }
      return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const saveDraft = () => {
    localStorage.setItem("farmlink_draft", JSON.stringify(formData));
    showToast("Draft saved locally!", "success");
  };

  const simulateOtp = () => {
    const phone = formData.phone;
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      showToast("Please enter a valid 10-digit phone number", "error");
      return;
    }

    setOtpCooldown(true);
    setCountdown(30);

    otpTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(otpTimerRef.current);
          setOtpCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    showToast("OTP sent: 123456 (demo mode)", "info");

    // Listen for OTP input
    const checkOtp = setInterval(() => {
      const otpInput = document.getElementById("otpCode");
      if (otpInput && otpInput.value === "123456") {
        updateFormField("otpVerified", true);
        showToast("Phone verified successfully!", "success");
        clearInterval(checkOtp);
      }
    }, 500);

    setTimeout(() => clearInterval(checkOtp), 60000);
  };

  const handleFileUpload = (field, file) => {
    updateFormField(field, file);
  };

  const handleSelfieCapture = () => {
    updateFormField("selfie", "captured");
    showToast("Selfie captured successfully!", "success");
  };

  const finalSubmit = () => {
    if (
      selectedRole === "farmer" &&
      (!formData.landProof || !formData.selfie)
    ) {
      showToast("Please upload land proof and capture selfie", "error");
      return;
    }
    showToast(
      `🎉 ${selectedRole === "farmer" ? "Farmer" : "Buyer"} registration submitted! Verification in progress.`,
      "success",
    );
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  const progressPercent =
    steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f4f9f5] via-[#fef8ed] to-[#e8f5ee] flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            className="absolute w-full h-full object-cover opacity-10"
            alt="farm background"
          />
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#2d7a4f] rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#f5a623] rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-fade-in-up">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌾</span>
              <span className="font-playfair text-2xl font-black text-[#1a4a2e]">
                Farm<span className="text-[#2d7a4f]">Link</span>
              </span>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="text-3xl font-playfair font-bold text-[#1a4a2e] mb-2">
              Join the FarmLink Community
            </h2>
            <p className="text-gray-500 mb-8">
              Choose how you want to participate in India's direct farm-to-table
              marketplace
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div
                onClick={() => setSelectedRole("buyer")}
                className="cursor-pointer rounded-2xl border-2 border-gray-200 p-6 text-center hover:border-[#2d7a4f] hover:bg-[#e8f5ee] transition-all group"
              >
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-[#1a4a2e] mb-2">
                  Buyer / Retailer
                </h3>
                <p className="text-gray-500 text-sm">
                  Purchase fresh produce, bulk orders, restaurant supplies
                  directly from farmers
                </p>
                <div className="mt-4 text-[#2d7a4f] opacity-0 group-hover:opacity-100 transition">
                  Select →
                </div>
              </div>

              <div
                onClick={() => setSelectedRole("farmer")}
                className="cursor-pointer rounded-2xl border-2 border-gray-200 p-6 text-center hover:border-[#2d7a4f] hover:bg-[#e8f5ee] transition-all group"
              >
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-xl font-bold text-[#1a4a2e] mb-2">
                  Farmer / Seller
                </h3>
                <p className="text-gray-500 text-sm">
                  Sell directly, get fair prices, FPO support, and reach
                  thousands of buyers
                </p>
                <div className="mt-4 text-[#2d7a4f] opacity-0 group-hover:opacity-100 transition">
                  Select →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Form Flow
  const stepId = steps[currentStep]?.id;

  const renderStepContent = () => {
    if (selectedRole === "buyer") {
      switch (stepId) {
        case "buyerBasic":
          return (
            <BuyerBasicStep
              formData={formData}
              updateFormField={updateFormField}
            />
          );
        case "buyerOtp":
          return (
            <BuyerOtpStep
              formData={formData}
              updateFormField={updateFormField}
              simulateOtp={simulateOtp}
              otpCooldown={otpCooldown}
              countdown={countdown}
            />
          );
        case "buyerBusiness":
          return (
            <BuyerBusinessStep
              formData={formData}
              updateFormField={updateFormField}
              handleFileUpload={handleFileUpload}
            />
          );
        case "buyerReview":
          return <BuyerReviewStep formData={formData} />;
        default:
          return null;
      }
    } else {
      switch (stepId) {
        case "farmerIdentity":
          return (
            <FarmerIdentityStep
              formData={formData}
              updateFormField={updateFormField}
            />
          );
        case "farmerOtp":
          return (
            <FarmerOtpStep
              formData={formData}
              updateFormField={updateFormField}
              simulateOtp={simulateOtp}
              otpCooldown={otpCooldown}
              countdown={countdown}
            />
          );
        case "farmerDocs":
          return (
            <FarmerDocsStep
              formData={formData}
              updateFormField={updateFormField}
              handleFileUpload={handleFileUpload}
              handleSelfieCapture={handleSelfieCapture}
            />
          );
        case "farmerFarm":
          return (
            <FarmerFarmStep
              formData={formData}
              updateFormField={updateFormField}
            />
          );
        case "farmerReview":
          return <FarmerReviewStep formData={formData} />;
        default:
          return null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f9f5] via-[#fef8ed] to-[#e8f5ee] py-8 px-4 relative">
      {/* Background imagery */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          className="absolute w-full h-full object-cover opacity-5"
          alt="farm landscape"
        />
        <img
          src="https://images.unsplash.com/photo-1592417817098-8fd3d9a14b5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
          className="absolute bottom-0 left-0 w-64 opacity-10"
          alt="wheat"
        />
        <img
          src="https://images.unsplash.com/photo-1592417817098-8fd3d9a14b5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
          className="absolute top-20 right-0 w-48 opacity-10 transform scale-x-[-1]"
          alt="wheat"
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d7a4f] rounded-full filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#f5a623] rounded-full filter blur-3xl opacity-5 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                <span className="font-playfair text-xl font-black text-[#1a4a2e]">
                  Farm<span className="text-[#2d7a4f]">Link</span>
                </span>
              </div>
              <button
                onClick={saveDraft}
                className="text-sm text-gray-400 hover:text-[#2d7a4f] transition"
              >
                <i className="far fa-save mr-1"></i> Save Draft
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex flex-wrap gap-3 mb-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-sm font-semibold ${idx === currentStep ? "text-[#2d7a4f]" : "text-gray-400"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${idx === currentStep ? "bg-[#2d7a4f] text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {idx + 1}
                  </div>
                  {step.title}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2d7a4f] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-gray-100">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="ml-auto px-8 py-3 rounded-full bg-[#2d7a4f] text-white font-semibold hover:bg-[#1a4a2e] transition shadow-md hover:shadow-lg"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={finalSubmit}
                  className="ml-auto px-8 py-3 rounded-full bg-[#2d7a4f] text-white font-semibold hover:bg-[#1a4a2e] transition shadow-md hover:shadow-lg"
                >
                  Complete Signup →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Buyer Step Components
const BuyerBasicStep = ({ formData, updateFormField }) => (
  <div className="animate-fade-in-up">
    <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
      👤 Tell us about yourself
    </h3>
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => updateFormField("fullName", e.target.value)}
          placeholder="Ramesh Kumar"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormField("email", e.target.value)}
          placeholder="buyer@example.com"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => updateFormField("password", e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
        />
      </div>
    </div>
    <div className="mt-6 p-4 bg-[#e8f5ee] rounded-xl flex items-center gap-3 text-sm text-[#1a4a2e]">
      <i className="fas fa-shield-alt"></i>
      <span>
        Your data is encrypted & secure. We never share with third parties.
      </span>
    </div>
  </div>
);

const BuyerOtpStep = ({
  formData,
  updateFormField,
  simulateOtp,
  otpCooldown,
  countdown,
}) => (
  <div className="animate-fade-in-up">
    <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
      📞 Verify Mobile Number
    </h3>
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormField("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
          <button
            onClick={simulateOtp}
            disabled={otpCooldown}
            className={`px-5 py-3 rounded-xl font-semibold transition ${otpCooldown ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#e8f5ee] text-[#2d7a4f] hover:bg-[#2d7a4f] hover:text-white"}`}
          >
            {otpCooldown ? `Wait ${countdown}s` : "Send OTP"}
          </button>
        </div>
      </div>
      {!formData.otpVerified && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter OTP
          </label>
          <input
            id="otpCode"
            type="text"
            maxLength="6"
            placeholder="6-digit OTP"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
        </div>
      )}
      {formData.otpVerified && (
        <div className="p-3 bg-green-50 rounded-xl text-green-600 flex items-center gap-2">
          <i className="fas fa-check-circle"></i>
          <span>Phone number verified successfully!</span>
        </div>
      )}
    </div>
    <div className="mt-6 p-4 bg-[#e8f5ee] rounded-xl flex items-center gap-3 text-sm text-[#1a4a2e]">
      <i className="fas fa-lock"></i>
      <span>
        OTP verification ensures genuine buyers & farmers on our platform.
      </span>
    </div>
  </div>
);

const BuyerBusinessStep = ({ formData, updateFormField, handleFileUpload }) => {
  const fileInputRef = useRef(null);
  return (
    <div className="animate-fade-in-up">
      <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
        🏢 Business Details (Optional)
      </h3>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Shop/Company Name
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => updateFormField("businessName", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            GST Number (if any)
          </label>
          <input
            type="text"
            value={formData.gst}
            onChange={(e) => updateFormField("gst", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Address
          </label>
          <textarea
            rows="2"
            value={formData.address}
            onChange={(e) => updateFormField("address", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition resize-none"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload ID Proof (Aadhaar/PAN)
          </label>
          <div
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#2d7a4f] hover:bg-[#e8f5ee] transition"
          >
            <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-500">Click to upload</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) =>
                e.target.files[0] &&
                handleFileUpload("idProof", e.target.files[0])
              }
            />
          </div>
          {formData.idProof && (
            <p className="text-sm text-green-600 mt-2">
              <i className="fas fa-check-circle mr-1"></i> File uploaded
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const BuyerReviewStep = ({ formData }) => (
  <div className="animate-fade-in-up">
    <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
      ✅ Review & Submit
    </h3>
    <div className="bg-[#e8f5ee] rounded-2xl p-6 space-y-3">
      <p>
        <strong>Name:</strong> {formData.fullName || "—"}
      </p>
      <p>
        <strong>Email:</strong> {formData.email || "—"}
      </p>
      <p>
        <strong>Phone:</strong> {formData.phone || "—"}{" "}
        {formData.otpVerified && "✓ Verified"}
      </p>
      <p>
        <strong>Business:</strong> {formData.businessName || "—"}
      </p>
      <p>
        <strong>ID Proof:</strong>{" "}
        {formData.idProof ? "Uploaded" : "Not provided"}
      </p>
      <div className="mt-4 inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
        ⏳ Verification Pending
      </div>
    </div>
    <div className="mt-6 p-4 bg-[#e8f5ee] rounded-xl flex items-center gap-3 text-sm text-[#1a4a2e]">
      <i className="fas fa-check-circle"></i>
      <span>After submission, our team will verify within 24 hours.</span>
    </div>
  </div>
);

// Farmer Step Components
const FarmerIdentityStep = ({ formData, updateFormField }) => (
  <div className="animate-fade-in-up">
    <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
      👨‍🌾 Farmer Identity
    </h3>
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name (as per Aadhaar) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => updateFormField("fullName", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormField("email", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormField("password", e.target.value)}
            placeholder="Min. 8 chars"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
        </div>
      </div>
    </div>
    <div className="mt-6 p-4 bg-[#e8f5ee] rounded-xl flex items-center gap-3 text-sm text-[#1a4a2e]">
      <i className="fas fa-id-card"></i>
      <span>
        Government verification is mandatory for farmers to prevent fraud.
      </span>
    </div>
  </div>
);

const FarmerOtpStep = ({
  formData,
  updateFormField,
  simulateOtp,
  otpCooldown,
  countdown,
}) => (
  <div className="animate-fade-in-up">
    <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
      📞 Mobile OTP Verification
    </h3>
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormField("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
          <button
            onClick={simulateOtp}
            disabled={otpCooldown}
            className={`px-5 py-3 rounded-xl font-semibold transition ${otpCooldown ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#e8f5ee] text-[#2d7a4f] hover:bg-[#2d7a4f] hover:text-white"}`}
          >
            {otpCooldown ? `Wait ${countdown}s` : "Send OTP"}
          </button>
        </div>
      </div>
      {!formData.otpVerified && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter OTP
          </label>
          <input
            id="otpCode"
            type="text"
            maxLength="6"
            placeholder="6-digit OTP"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
        </div>
      )}
      {formData.otpVerified && (
        <div className="p-3 bg-green-50 rounded-xl text-green-600 flex items-center gap-2">
          <i className="fas fa-check-circle"></i>
          <span>Phone verified successfully!</span>
        </div>
      )}
    </div>
  </div>
);

const FarmerDocsStep = ({
  formData,
  updateFormField,
  handleFileUpload,
  handleSelfieCapture,
}) => {
  const landProofRef = useRef(null);
  return (
    <div className="animate-fade-in-up">
      <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
        🪪 Government ID & Selfie Capture
      </h3>
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aadhaar Number
            </label>
            <input
              type="text"
              value={formData.aadhaar}
              onChange={(e) => updateFormField("aadhaar", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PAN (optional)
            </label>
            <input
              type="text"
              value={formData.pan}
              onChange={(e) => updateFormField("pan", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Land Ownership / Patta{" "}
            <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => landProofRef.current.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#2d7a4f] hover:bg-[#e8f5ee] transition"
          >
            <i className="fas fa-file-upload text-2xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-500">
              Click to upload land document
            </p>
            <input
              ref={landProofRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) =>
                e.target.files[0] &&
                handleFileUpload("landProof", e.target.files[0])
              }
            />
          </div>
          {formData.landProof && (
            <p className="text-sm text-green-600 mt-2">
              <i className="fas fa-check-circle mr-1"></i> Document uploaded
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Live Selfie (Real-time capture){" "}
            <span className="text-red-500">*</span>
          </label>
          <div
            onClick={handleSelfieCapture}
            className="bg-gray-100 rounded-xl p-6 text-center cursor-pointer hover:bg-[#e8f5ee] transition"
          >
            <i className="fas fa-camera text-3xl text-gray-500 mb-2"></i>
            <p className="text-sm text-gray-500">Click to capture selfie</p>
          </div>
          {formData.selfie && (
            <p className="text-sm text-green-600 mt-2">
              <i className="fas fa-check-circle mr-1"></i> Selfie captured
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 p-4 bg-[#e8f5ee] rounded-xl flex items-center gap-3 text-sm text-[#1a4a2e]">
        <i className="fas fa-user-check"></i>
        <span>Your selfie & documents are encrypted for KYC compliance.</span>
      </div>
    </div>
  );
};

const FarmerFarmStep = ({ formData, updateFormField }) => (
  <div className="animate-fade-in-up">
    <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
      🌱 Farm Location & Crops
    </h3>
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Farm Location (GPS / Village)
        </label>
        <input
          type="text"
          value={formData.farmLocation}
          onChange={(e) => updateFormField("farmLocation", e.target.value)}
          placeholder="e.g., Ramanathapuram, Tamil Nadu"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Crops You Grow (comma separated)
        </label>
        <input
          type="text"
          value={formData.crops.join(", ")}
          onChange={(e) =>
            updateFormField(
              "crops",
              e.target.value.split(",").map((s) => s.trim()),
            )
          }
          placeholder="Rice, Tomato, Onion"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bank Account Number
          </label>
          <input
            type="text"
            value={formData.bankAcc}
            onChange={(e) => updateFormField("bankAcc", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IFSC Code
          </label>
          <input
            type="text"
            value={formData.ifsc}
            onChange={(e) => updateFormField("ifsc", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 outline-none transition"
          />
        </div>
      </div>
    </div>
  </div>
);

const FarmerReviewStep = ({ formData }) => (
  <div className="animate-fade-in-up">
    <h3 className="text-2xl font-playfair font-bold text-[#1a4a2e] mb-6">
      📋 Final Review
    </h3>
    <div className="bg-[#e8f5ee] rounded-2xl p-6 space-y-3">
      <p>
        <strong>Farmer:</strong> {formData.fullName || "—"}
      </p>
      <p>
        <strong>Phone:</strong> {formData.phone || "—"}{" "}
        {formData.otpVerified && "✓"}
      </p>
      <p>
        <strong>Aadhaar:</strong>{" "}
        {formData.aadhaar ? "****" + formData.aadhaar.slice(-4) : "—"}
      </p>
      <p>
        <strong>Land Proof:</strong>{" "}
        {formData.landProof ? "✅ Uploaded" : "❌ Missing"}
      </p>
      <p>
        <strong>Selfie:</strong>{" "}
        {formData.selfie ? "✅ Captured" : "⚠️ Required"}
      </p>
      <p>
        <strong>Farm Location:</strong> {formData.farmLocation || "—"}
      </p>
      <p>
        <strong>Crops:</strong> {formData.crops.join(", ") || "—"}
      </p>
      <div className="mt-4 inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
        ⏳ Verification Pending
      </div>
    </div>
  </div>
);

export default SignupFlow;

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import useAxiosPublic from "../../hooks/useAxiosPublic";

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitForm = async (data) => {
    try {
      setLoading(true);

      // Sanitize: trim whitespace & uppercase transaction_Id before sending
      const cleanedData = {
        ...data,
        transaction_Id: data.transaction_Id?.trim().toUpperCase(),
        phone_number: data.phone_number?.trim(),
        whatsapp_number: data.whatsapp_number?.trim(),
        sendmoney_number: data.sendmoney_number?.trim(),
        ssc_exam_roll: data.ssc_exam_roll?.trim(),
        ssc_regi_number: data.ssc_regi_number?.trim(),
      };

      const response = await axiosPublic.post("/registration", cleanedData);

      if (response.data.success || response.data.insertedId) {
        toast.success("Registration successful!");
        reset();
        setShowSuccessModal(true);
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration submit error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
            Registration Form
          </h1>
          <p className="text-md font-medium text-slate-600">
            If you have any questions, please contact us at the provided phone
            number.
          </p>
          <p className="mt-2 text-sm font-semibold text-blue-600">
            Bkash/Nagad: 01859902430
          </p>
        </div>
        {/* Personal Information div*/}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-3 md:grid-cols-2 md:p-6 shadow-sm">
          {/* Name English */}
          <div>
            <label className="label">Name *</label>
            <input
              {...register("name_en", {
                required: "Name is required",
              })}
              placeholder="Write Your Full Name"
              className="input input-bordered w-full"
            />
            {errors.name_en && (
              <p className="text-error">{errors.name_en.message}</p>
            )}
          </div>
          {/* Group*/}
          <div>
            <label className="label">Group *</label>
            <select
              {...register("group", {
                required: "group is required",
              })}
              className="select select-bordered w-full"
            >
              <option value="">Select</option>
              <option value="science">Science</option>
              <option value="commerce">Commerce</option>
              <option value="arts">Arts</option>
            </select>
            {errors.group && (
              <p className="text-error">{errors.group.message}</p>
            )}
          </div>
          {/* ssc_exam_roll*/}
          <div>
            <label className="label">SSC Exam Roll *</label>
            <input
              {...register("ssc_exam_roll", {
                required: "SSC Exam Roll is required",
                pattern: {
                  value: /^[0-9]{5,8}$/,
                  message: "সঠিক ৫-৮ ডিজিটের রোল নম্বর দিন",
                },
              })}
              placeholder="SSC Exam Roll"
              className="input input-bordered w-full"
            />
            {errors.ssc_exam_roll && (
              <p className="text-error">{errors.ssc_exam_roll.message}</p>
            )}
          </div>
          {/* registration_number */}
          <div>
            <label className="label">
              Registration Number *
            </label>
            <input
              {...register("ssc_regi_number", {
                required: " SSC Registration Number is Required",
              })}
              placeholder="Write SSC Registration Number"
              className="input input-bordered w-full"
            />
            {errors.ssc_regi_number && (
              <p className="text-error">{errors.ssc_regi_number.message}</p>
            )}
          </div>
        </div>
        {/* Educational Information */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-3 md:grid-cols-2 md:p-6 shadow-sm">
          {/* School Name */}
          <div>
            <label className="label">
              Institution Name *
            </label>
            <input
              {...register("institution_name", {
                required: "Institution Name is Required",
              })}
              placeholder="Your School Name"
              className="input input-bordered w-full"
            />
            {errors.institution_name && (
              <p className="text-error">{errors.institution_name.message}</p>
            )}
          </div>
          {/* Tshirt Size */}
          <div>
            <label className="label">T-Shirt Size *</label>
            <select
              {...register("tshirt_size", {
                required: "tshirt size is required",
              })}
              className="select select-bordered w-full"
            >
              <option value="">Select</option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
              <option value="xxl">XXL</option>
              <option value="3xl">3XL</option>
            </select>
            {errors.tshirt_size && (
              <p className="text-error">{errors.tshirt_size.message}</p>
            )}
          </div>

          {/* Bkash Number */}
          <div>
            <label className="label">
              Bkash/Nagad Number *
            </label>
            <input
              {...register("sendmoney_number", {
                required: " number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message:
                    "বাংলাদেশি মোবাইল নম্বর দিন (১১ ডিজিট)। যে নাম্বার থেকে ফি পাঠিয়েছেন।",
                },
              })}
              placeholder="Bkash/Nagad Number in 01XXXXXXXXX format"
              className="input input-bordered w-full"
            />
            {errors.sendmoney_number && (
              <p className="text-error">{errors.sendmoney_number.message}</p>
            )}
          </div>
          {/* Transaction Id */}
          <div>
            <label className="label">Transaction Id *</label>
            <input
              {...register("transaction_Id", {
                required: "Transaction Id is required",
                pattern: {
                  value: /^[A-Za-z0-9]{6,20}$/,
                  message: "Transaction ID হবে ৬-২০ অক্ষরের, শুধু অক্ষর ও সংখ্যা (Bkash/Nagad TrxID)",
                },
              })}
              placeholder="Write Transaction Id"
              className="input input-bordered w-full"
            />
            {errors.transaction_Id && (
              <p className="text-error">{errors.transaction_Id.message}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-green-100 bg-green-50 p-3 md:grid-cols-2 md:p-6 shadow-sm">
          {/* Phone */}
          <div>
            <label className="label">Phone Number *</label>
            <input
              {...register("phone_number", {
                required: "Phone number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message: "Give a valid Bangladeshi mobile number (11 digits)",
                },
              })}
              placeholder="Phone"
              className="input input-bordered w-full"
            />
            {errors.phone_number && (
              <p className="text-error">{errors.phone_number.message}</p>
            )}
          </div>

          {/* whatsapp */}
          <div>
            <label className="label">
              Whatsapp Number *
            </label>
            <input
              {...register("whatsapp_number", {
                required: "Whatsapp number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message: "Give a valid Bangladeshi mobile number (11 digits)",
                },
              })}
              placeholder="Whatsapp Number"
              className="input input-bordered w-full"
            />
            {errors.whatsapp_number && (
              <p className="text-error">{errors.whatsapp_number.message}</p>
            )}
          </div>
          {/* Present Adress */}
          <div>
            <label className="label">
              Present Address *
            </label>
            <div className="flex gap-2">
              <input
                {...register("present_area", { required: true })}
                placeholder="Area"
                className="input input-bordered w-full"
              />
              <input
                {...register("present_thana", { required: true })}
                placeholder="Thana"
                className="input input-bordered w-full"
              />
              <input
                {...register("present_zilla", { required: true })}
                placeholder="Zilla"
                className="input input-bordered w-full"
              />
            </div>
          </div>
          {/* Permanent Adress */}
          <div>
            <label className="label">
              Permanent Address *
            </label>
            <div className="flex gap-2">
              <input
                {...register("permanent_area", { required: true })}
                placeholder="Area"
                className="input input-bordered w-full"
              />
              <input
                {...register("permanent_thana", { required: true })}
                placeholder="Thana"
                className="input input-bordered w-full"
              />
              <input
                {...register("permanent_zilla", { required: true })}
                placeholder="Zilla"
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{
              backgroundImage: `linear-gradient(135deg, #5b7bb8 0%, #4a69a1 100%)`,
            }}
          >
            {loading ? (
              <>
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-3" />
                প্রসেসিং...
              </>
            ) : (
              "রেজিস্ট্রেশন সম্পন্ন করুন"
            )}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 mb-6">
                <svg
                  className="h-10 w-10 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                রেজিস্ট্রেশন এবং পেমেন্ট যাচাইকরণ নোটিশ
              </h2>
              <p className="text-md text-slate-600 leading-relaxed mb-8">
                আপনার রেজিস্ট্রেশন ফরমটি সফলভাবে সাবমিট করা হয়েছে। আমরা আপনার পাঠানো <strong>Bkash/Nagad</strong> ট্রানজেকশন আইডি এবং মোবাইল নম্বরটি ম্যানুয়ালি রিভিউ করছি। রিভিউ সম্পন্ন হলে আপনার রেজিস্ট্রেশন কনফার্ম করা হবে। নিচে আপনার রেজিস্টার্ড মোবাইল নম্বর দিয়ে সার্চ করে যেকোনো সময় বর্তমান স্ট্যাটাস জানতে পারবেন।
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/my-registration");
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-200 cursor-pointer"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #173083 0%, #0b1a4a 100%)`,
                  }}
                >
                  স্ট্যাটাস চেক করুন
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop bg-slate-900/50 backdrop-blur-sm"></div>
        </dialog>
      )}
    </>
  );
};

export default RegistrationForm;

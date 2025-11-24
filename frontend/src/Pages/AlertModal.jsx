import React from "react";

function AlertModal({ isOpen, type, title, message, onClose, onConfirm }) {
  if (!isOpen) return null;

  const iconColor =
    type === "success"
      ? "text-green-600"
      : type === "error"
      ? "text-red-600"
      : type === "delete-confirm"
      ? "text-yellow-500"
      : "text-blue-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold"
        >
          ×
        </button>

        {/* ICONS */}
        <div className="flex justify-center mb-4">

          {/* SUCCESS ICON */}
          {type === "success" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-16 w-16 ${iconColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}

          {/* ERROR ICON */}
          {type === "error" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-16 w-16 ${iconColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
              />
            </svg>
          )}

          {/* DELETE CONFIRM — YELLOW WARNING TRIANGLE WITH CLEAR "!" */}
          {type === "delete-confirm" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              viewBox="0 0 24 24"
            >
              {/* Triangle */}
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                fill="#fff7cc"        /* Light yellow background */
                stroke="#d97706"      /* Dark yellow border */
                strokeWidth="2"
              />

              {/* ! top line */}
              <line
                x1="12"
                y1="9"
                x2="12"
                y2="14"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* ! dot */}
              <circle
                cx="12"
                cy="17"
                r="1.3"
                fill="#d97706"
              />
            </svg>
          )}

        </div>

        {/* TEXT */}
        <h2 className="text-xl font-bold text-center mb-2">{title}</h2>

        <p className="text-center text-gray-600 mb-6">{message}</p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">
          {type === "delete-confirm" ? (
            <>
              <button
                onClick={onClose}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              OK
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default AlertModal;

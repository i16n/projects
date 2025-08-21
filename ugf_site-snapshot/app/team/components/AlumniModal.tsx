import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, Building, GraduationCap, Briefcase } from "lucide-react";

interface AlumniMember {
  id: string;
  name: string;
  school: string;
  degree: string;
  firstJob?: string;
  LinkedIn?: string;
}

interface AlumniModalProps {
  alumni: AlumniMember;
  onClose: () => void;
}

export default function AlumniModal({ alumni, onClose }: AlumniModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gray-800 rounded-lg shadow-xl p-5 m-4 w-full max-w-md text-white"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{alumni.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* School */}
            {alumni.school && (
              <div className="flex items-start">
                <Building
                  size={20}
                  className="text-gray-400 mr-3 mt-1 flex-shrink-0"
                />
                <div>
                  <h3 className="text-sm text-gray-400 font-medium">School</h3>
                  <p className="text-gray-200">{alumni.school}</p>
                </div>
              </div>
            )}

            {/* Degree/Major */}
            {alumni.degree && (
              <div className="flex items-start">
                <GraduationCap
                  size={20}
                  className="text-gray-400 mr-3 mt-1 flex-shrink-0"
                />
                <div>
                  <h3 className="text-sm text-gray-400 font-medium">Major</h3>
                  <p className="text-gray-200">{alumni.degree}</p>
                </div>
              </div>
            )}

            {/* First Job */}
            {alumni.firstJob && (
              <div className="flex items-start">
                <Briefcase
                  size={20}
                  className="text-gray-400 mr-3 mt-1 flex-shrink-0"
                />
                <div>
                  <h3 className="text-sm text-gray-400 font-medium">
                    First Post-Grad Job
                  </h3>
                  <p className="text-gray-200">{alumni.firstJob}</p>
                </div>
              </div>
            )}

            {/* LinkedIn */}
            <div className="flex items-start">
              <Linkedin
                size={20}
                className="text-gray-400 mr-3 mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="text-sm text-gray-400 font-medium">LinkedIn</h3>
                {alumni.LinkedIn ? (
                  <a
                    href={alumni.LinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#17A2FF] hover:text-[#B2E0FF]"
                  >
                    <Linkedin size={16} />
                  </a>
                ) : (
                  <a
                    href={alumni.LinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grey-400 hover:text-grey-300 flex items-center"
                  >
                    <Linkedin size={16} className="mr-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

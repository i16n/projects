import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Linkedin,
  GraduationCap,
  Building,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
// Removed direct airtable import - now using API endpoint for caching
import { useLoading } from "@/app/contexts/LoadingContext";

interface Deal {
  id: string;
  name: string;
  stage: string;
  logo: Array<{
    id: string;
    url: string;
  }>;
  stageInvested: string;
  description: string;
  website: string;
  sector: string;
  status: "active" | "exited";
  dealLeads: string[];
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  school: string;
  photo: string;
  degree: string;
  office?: string;
  LinkedIn?: string;
  deals?: Deal[];
}

interface ModalProps {
  member: TeamMember;
  onClose: () => void;
}

export default function Modal({ member, onClose }: ModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [deals, setDeals] = useState<[string, string][]>([]); // expect an array of tuples (id, name)
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const { showLoading } = useLoading();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoadingDeals(true);
        const response = await fetch("/api/members-deals");
        if (!response.ok) {
          throw new Error("Failed to fetch deals mapping");
        }
        const membersDealsObject = await response.json();
        // Get deals for this specific member
        setDeals(membersDealsObject[member.id] || []);
      } catch (error) {
        setDeals([]);
      } finally {
        setIsLoadingDeals(false);
      }
    };

    fetchDeals();
  }, [member.id]);

  // Memoize the bio processing to avoid recalculating on every render
  const bioData = useMemo(() => {
    // For very short bios, avoid unnecessary processing
    if (!member.bio || member.bio.length < 150) {
      return {
        needsTruncation: false,
        truncatedBio: member.bio,
      };
    }

    const words = member.bio.split(/\s+/);
    const maxWords = 70;
    const needsTruncation = words.length > maxWords;
    const truncatedBio = needsTruncation
      ? words.slice(0, maxWords).join(" ") + "..."
      : member.bio;

    return { needsTruncation, truncatedBio };
  }, [member.bio]);

  // Use the memoized values
  const displayBio = isExpanded ? member.bio : bioData.truncatedBio;

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

  const handleDealClick = (dealId: string) => {
    showLoading();
    onClose();
    router.replace(`/portfolio?deal=${dealId}`, { scroll: false });
  };

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
          className="bg-black shadow-xl p-6 m-4 max-w-xl w-full text-white overflow-y-auto max-h-[90vh]"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-[#B2E0FF]">{member.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col">
              <Image
                src={member.photo || "/placeholder.svg"}
                alt={member.name}
                width={200}
                height={200}
                className="object-cover w-full h-auto"
              />

              {/* Education and School Information with Office at the top */}
              {(member.school || member.degree || member.office) && (
                <div className="mt-3 p-3 border border-white">
                  {member.office && (
                    <div className="flex items-center mb-1">
                      <MapPin size={16} className="text-gray-300 mr-2" />
                      <p className="text-gray-200 text-sm">{member.office}</p>
                    </div>
                  )}
                  {member.school && (
                    <div className="flex items-center mb-1">
                      <Building size={16} className="text-gray-300 mr-2" />
                      <p className="text-gray-200 text-sm">{member.school}</p>
                    </div>
                  )}
                  {member.degree && (
                    <div className="flex items-start">
                      <GraduationCap
                        size={16}
                        className="text-gray-300 mr-2 flex-shrink-0 mt-1"
                      />
                      <p className="text-gray-200 text-sm">{member.degree}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="md:w-2/3 md:pl-6">
              <p className="text-white font-semibold text-sm mb-2">
                {member.title}
              </p>
              <hr className="border-white mb-4" />

              {/* Bio Section with Read More functionality */}
              <div className="mb-4">
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-200 text-sm"
                >
                  <p>{displayBio}</p>

                  {bioData.needsTruncation && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-white hover:text-gray-300 mt-2 flex items-center text-sm font-medium"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp size={16} className="ml-1" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown size={16} className="ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </motion.div>
              </div>

              {/* Deals section */}
              {!isLoadingDeals && deals.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Deals
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {deals.map((deal) => (
                      <button
                        key={deal[0]}
                        onClick={() => handleDealClick(deal[0])} // deal[0] is id
                        className="border border-black px-3 py-1 text-sm font-medium text-black bg-white hover:bg-black hover:border-white hover:text-white transition-colors"
                      >
                        {deal[1]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex space-x-4 mt-4">
                {member.LinkedIn && (
                  <a
                    href={member.LinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300"
                    title="LinkedIn"
                  >
                    <Linkedin size={20} />
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

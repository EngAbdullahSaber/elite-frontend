// // components/shared/DownloadContent/index.tsx
// "use client";
// import { useState } from "react";
// import ExportMenuContent from "./ExportMenuContent";

// try {
//   MenuComponent = require("@/components/shared/Menu").default;
// } catch (error) {
//   console.warn("Menu component not found, using fallback");
//   try {
//     MenuComponent = require("./SimpleMenu").default;
//   } catch {
//     // Create inline fallback if both imports fail
//     MenuComponent = function FallbackMenu({
//       trigger,
//       children,
//       width = 300,
//       align = "left",
//     }: any) {
//       const [isOpen, setIsOpen] = useState(false);

//       const toggle = () => setIsOpen(!isOpen);
//       const close = () => setIsOpen(false);

//       return (
//         <div className="relative inline-block">
//           {trigger(toggle)}
//           {isOpen && (
//             <div
//               className={`absolute top-full mt-2 z-50 ${
//                 align === "right" ? "right-0" : "left-0"
//               }`}
//               style={{ width: `${width}px` }}
//             >
//               <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
//                 {children(close)}
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     };
//   }
// }

// interface DownloadContentProps {
//   text?: string;
//   module?: string;
//   currentData?: any[];
//   filters?: Record<string, any>;
// }

// export default function DownloadContent({
//   text = "تحميل القائمة",
//   module = "campaign",
//   currentData = [],
//   filters = {},
// }: DownloadContentProps) {
//   return (
//     <MenuComponent
//       width={300}
//       align="left"
//       trigger={(toggle: () => void) => (
//         <button className="btn-primary" onClick={toggle}>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             aria-hidden="true"
//             className="w-5 h-5 inline-block ml-2"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
//             />
//           </svg>
//           {text}
//         </button>
//       )}
//     >
//       {(close: () => void) => (
//         <ExportMenuContent
//           onClose={close}
//           module={module}
//           currentData={currentData}
//           filters={filters}
//         />
//       )}
//     </MenuComponent>
//   );
// }

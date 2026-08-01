import React from "react";

interface SubmissionBadgeProps {
    status: string;
    variant?: "success" | "warning" | "error" | "info";
}

const SubmissionBadge: React.FC<SubmissionBadgeProps> = ({ status, variant = "info" }) => {
    const badgeColors = {
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
        error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColors[variant]}`}>
            {status}
        </span>
    );
};

export default SubmissionBadge;

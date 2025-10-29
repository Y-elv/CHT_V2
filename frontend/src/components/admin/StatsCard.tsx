// components/admin/StatsCard.tsx
import React from "react";
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { formatNumber } from "../../utils/formatters";

const MotionBox = motion(Box);

interface StatsCardProps {
  label: string;
  value: number | string;
  trend?: number;
  icon: React.ReactNode;
  gradient: string;
  subtitle?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  trend,
  icon,
  gradient,
  subtitle,
  onClick,
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      bgGradient={gradient}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      minH="140px"
    >
      <Stat>
        <StatLabel
          display="flex"
          alignItems="center"
          gap={2}
          color="whiteAlpha.900"
          fontSize="sm"
        >
          {icon}
          {label}
        </StatLabel>
        <StatNumber fontSize="3xl" fontWeight="bold" color="white" mt={2}>
          {typeof value === "number" ? formatNumber(value) : value}
        </StatNumber>
        {trend !== undefined && (
          <StatHelpText color="whiteAlpha.800" fontSize="sm">
            <StatArrow type={trend > 0 ? "increase" : "decrease"} />
            {Math.abs(trend)}% from last month
          </StatHelpText>
        )}
        {subtitle && (
          <StatHelpText color="whiteAlpha.700" fontSize="xs" mt={1}>
            {subtitle}
          </StatHelpText>
        )}
      </Stat>
    </MotionBox>
  );
};

export default StatsCard;

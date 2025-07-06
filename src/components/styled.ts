import styled from 'styled-components';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION } from '../constants/theme';

// Gradient Background
export const GradientBackground = styled.div`
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Container
export const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${SPACING.l};
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: ${SPACING.m};
  }

  @media (min-width: 1200px) {
    max-width: 1400px;
  }
`;

// Content
export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${SPACING.xl} 0;
  width: 100%;

  @media (max-width: 768px) {
    padding: ${SPACING.l} 0;
  }
`;

// Typography
export const Title = styled.h1`
  font-size: ${SIZES.h1};
  font-weight: bold;
  color: ${COLORS.text};
  margin-bottom: ${SPACING.s};
  font-family: ${FONTS.bold};

  @media (max-width: 768px) {
    font-size: 36px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

export const Subtitle = styled.h2`
  font-size: ${SIZES.h2};
  font-weight: bold;
  color: ${COLORS.text};
  margin-bottom: ${SPACING.m};
  font-family: ${FONTS.bold};

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const Tagline = styled.p`
  font-size: ${SIZES.body1};
  color: ${COLORS.text};
  margin-bottom: ${SPACING.l};
  font-family: ${FONTS.regular};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const Description = styled.p`
  font-size: ${SIZES.body2};
  color: ${COLORS.textSecondary};
  line-height: 1.6;
  margin-bottom: ${SPACING.l};
  font-family: ${FONTS.regular};

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// Buttons
export const Button = styled.button<{ variant?: 'primary' | 'outline' }>`
  background: ${props => props.variant === 'outline' ? 'transparent' : COLORS.primaryLight};
  border: 2px solid ${COLORS.primaryLight};
  color: ${COLORS.text};
  padding: ${SPACING.m} ${SPACING.xl};
  border-radius: ${BORDER_RADIUS.round};
  font-size: ${SIZES.body1};
  font-weight: bold;
  font-family: ${FONTS.bold};
  cursor: pointer;
  transition: all ${ANIMATION.normal};
  min-width: 200px;
  margin: ${SPACING.s} 0;

  @media (max-width: 768px) {
    min-width: 180px;
    padding: ${SPACING.m} ${SPACING.l};
    font-size: 16px;
  }

  @media (max-width: 480px) {
    min-width: 160px;
    padding: ${SPACING.s} ${SPACING.m};
    font-size: 14px;
  }

  &:hover {
    transform: translateY(-2px);
    ${SHADOWS.medium}
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.m};
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 500px;
  }

  @media (min-width: 1024px) {
    max-width: 600px;
  }
`;

// Cards
export const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${BORDER_RADIUS.l};
  padding: ${SPACING.l};
  margin-bottom: ${SPACING.m};
  backdrop-filter: blur(10px);
  ${SHADOWS.light}

  @media (max-width: 768px) {
    padding: ${SPACING.m};
  }
`;

// Header
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${SPACING.l};
  border-bottom: 1px solid ${COLORS.primaryLight};

  @media (max-width: 768px) {
    padding: ${SPACING.m};
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.text};
  font-size: ${SIZES.body1};
  font-weight: bold;
  font-family: ${FONTS.bold};
  cursor: pointer;
  padding: ${SPACING.s};
  transition: opacity ${ANIMATION.fast};

  @media (max-width: 768px) {
    font-size: 16px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

// Icon
export const HeartIcon = styled.div`
  width: 160px;
  height: 160px;
  background: ${COLORS.primaryLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${SPACING.l} 0;
  position: relative;

  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }

  @media (min-width: 1024px) {
    width: 240px;
    height: 240px;
  }

  &::before {
    content: '♥';
    font-size: 80px;
    color: ${COLORS.text};

    @media (min-width: 768px) {
      font-size: 100px;
    }

    @media (min-width: 1024px) {
      font-size: 120px;
    }
  }
`;

// Accent dots
export const AccentDot = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${COLORS.primaryLight};
  opacity: 0.7;
  margin: 0 ${SPACING.s};

  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

export const IconRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${SPACING.l} 0;
`;

// Form elements
export const Input = styled.input`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${BORDER_RADIUS.m};
  padding: ${SPACING.m};
  color: ${COLORS.text};
  font-size: ${SIZES.body1};
  font-family: ${FONTS.regular};
  width: 100%;
  margin-bottom: ${SPACING.m};

  @media (max-width: 768px) {
    font-size: 16px;
    padding: ${SPACING.s} ${SPACING.m};
  }

  &::placeholder {
    color: ${COLORS.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.primaryLight};
    ${SHADOWS.glow}
  }
`;

export const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${BORDER_RADIUS.m};
  padding: ${SPACING.m};
  color: ${COLORS.text};
  font-size: ${SIZES.body1};
  font-family: ${FONTS.regular};
  width: 100%;
  min-height: 100px;
  resize: vertical;
  margin-bottom: ${SPACING.m};

  @media (max-width: 768px) {
    font-size: 16px;
    padding: ${SPACING.s} ${SPACING.m};
  }

  &::placeholder {
    color: ${COLORS.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.primaryLight};
    ${SHADOWS.glow}
  }
`;

// Grid
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${SPACING.m};
  margin: ${SPACING.l} 0;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${SPACING.l};
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

export const GridItem = styled.div<{ selected?: boolean }>`
  background: ${props => props.selected ? COLORS.primaryLight : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${COLORS.primaryLight};
  border-radius: ${BORDER_RADIUS.m};
  padding: ${SPACING.m};
  text-align: center;
  cursor: pointer;
  transition: all ${ANIMATION.normal};
  font-size: ${SIZES.body2};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  color: ${COLORS.text};
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    padding: ${SPACING.l};
    font-size: ${SIZES.body1};
    min-height: 100px;
  }

  &:hover {
    background: ${COLORS.primaryLight};
    transform: translateY(-2px);
    ${SHADOWS.medium}
  }
`;

// Footer
export const Footer = styled.footer`
  padding: ${SPACING.l};
  border-top: 1px solid ${COLORS.primaryLight};
  text-align: center;

  @media (max-width: 768px) {
    padding: ${SPACING.m};
  }
`;

// Responsive
export const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: ${SPACING.m};
  }
`;

// Chat specific components
export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  width: 100%;
  max-width: 100%;

  @media (min-width: 768px) {
    height: calc(100vh - 180px);
  }

  @media (min-width: 1024px) {
    height: calc(100vh - 160px);
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (min-width: 768px) {
    padding: 24px;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
    gap: 24px;
  }
`;

export const MessageBubble = styled.div<{ isSender: boolean }>`
  display: flex;
  justify-content: ${props => props.isSender ? 'flex-end' : 'flex-start'};
  margin-bottom: 8px;
  width: 100%;

  .message-card {
    max-width: 70%;
    background-color: ${props => props.isSender ? '#A084E8' : 'rgba(255, 255, 255, 0.2)'};
    border-radius: ${props => props.isSender ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
    padding: 12px 16px;
    margin: 0;

    @media (min-width: 768px) {
      max-width: 60%;
      padding: 16px 20px;
    }

    @media (min-width: 1024px) {
      max-width: 50%;
      padding: 20px 24px;
    }
  }
`;

export const ChatInputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 16px 24px;
  width: 100%;

  @media (min-width: 768px) {
    padding: 20px 32px;
    gap: 12px;
  }

  @media (min-width: 1024px) {
    padding: 24px 40px;
    gap: 16px;
  }
`;

 
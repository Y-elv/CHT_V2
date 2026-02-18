import React from 'react';
import { Box, Text, Heading, Button } from '@chakra-ui/react';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in React component tree
 * Provides user-friendly error display
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('🚨 [ERROR BOUNDARY] Caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Error fallback UI
      return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p={8}>
          <Box 
            maxW="500px" 
            p={8} 
            borderRadius="lg" 
            bg="red.50" 
            border="1px solid" 
            borderColor="red.200"
            textAlign="center"
          >
            <Heading color="red.600" size="lg" mb={4}>
              Oops! Something went wrong
            </Heading>
            
            <Text color="red.500" mb={6}>
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </Text>
            
            <Box mb={4}>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Error details:
              </Text>
              <Text 
                fontSize="xs" 
                color="gray.500" 
                bg="gray.100" 
                p={2} 
                borderRadius="md"
                fontFamily="mono"
              >
                {this.state.error?.toString() || 'Unknown error'}
              </Text>
            </Box>
            
            <Button 
              colorScheme="red" 
              onClick={this.handleReset}
              width="full"
            >
              Try Again
            </Button>
          </Box>
        </Box>
      );
    }

    // Normal render
    return this.props.children;
  }
}

export default ErrorBoundary;

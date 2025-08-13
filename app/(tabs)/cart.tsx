import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function CartTab() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to cart modal when this tab is accessed
    router.replace('/(modals)/cart');
  }, []);

  // This component won't render anything as it immediately redirects
  return null;
} 
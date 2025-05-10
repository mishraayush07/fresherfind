import ChatBot from '@/components/Chat/ChatBot';

export const metadata = {
  title: 'Chat Assistant - City Listing',
  description: 'Get help finding the perfect accommodation with our AI assistant',
};

export default function ChatPage() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      
      
      <div className="flex justify-center">
        <ChatBot />
      </div>
      
      
    </div>
  );
} 
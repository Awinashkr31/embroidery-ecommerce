import React, { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { Mail, Calendar, User, Search, RefreshCw } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Messages</h1>
          <p className="text-stone-600">View and manage customer inquiries ({messages.length})</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all outline-none"
            />
          </div>
          <button 
            onClick={fetchMessages}
            className="p-2 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-900"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-12 text-center">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">No messages found</h3>
          <p className="text-stone-500">
            {searchTerm ? 'Try adjusting your search terms' : 'New messages will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">{msg.subject}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-stone-700">{msg.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${msg.email}`} className="hover:text-rose-900 transition-colors">
                        {msg.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(msg.created_at)}</span>
                    </div>
                  </div>
                </div>
                {/* Status or Actions could go here */}
              </div>
              
              <div className="bg-stone-50 rounded-lg p-4 text-stone-700 whitespace-pre-wrap leading-relaxed border border-stone-100">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;

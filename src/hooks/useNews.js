import { useQuery } from 'react-query';
import axios from 'axios';

// Fallback data in case API call fails
const FALLBACK_NEWS = [
  {
    id: 'fallback-1',
    title: 'Tensions Rise as Nuclear Powers Exchange Warnings',
    source: 'Global News Network',
    url: '#',
    publishedAt: new Date().toISOString(),
    isBreaking: true,
    category: 'nuclear'
  },
  {
    id: 'fallback-2',
    title: 'Scientists Warn of Climate Tipping Points Approaching',
    source: 'Science Daily',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    isBreaking: false,
    category: 'climate'
  },
  {
    id: 'fallback-3',
    title: 'UN Security Council Calls Emergency Meeting on Missile Tests',
    source: 'World Affairs',
    url: '#',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    isBreaking: true,
    category: 'military'
  },
  {
    id: 'fallback-4',
    title: 'New AI System Raises Concerns About Autonomous Weapons',
    source: 'Tech Review',
    url: '#',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    isBreaking: false,
    category: 'technology'
  },
  {
    id: 'fallback-5',
    title: 'Diplomatic Channels Reopen Between Nuclear Powers',
    source: 'Diplomatic Times',
    url: '#', 
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    isBreaking: false,
    category: 'diplomacy'
  }
];

/**
 * Keywords to search for when fetching news
 */
const SEARCH_KEYWORDS = [
  'nuclear', 'doomsday', 'missile', 'ICBM', 'war', 
  'Putin', 'NATO', 'Iran', 'Israel', 'North Korea', 
  'radiation', 'atomic', 'Biden', 'China', 'military', 
  'rocket', 'explosion', 'nuclear alert'
];

/**
 * Hook to fetch relevant news articles
 * Uses NewsAPI, GNews, or fallback data
 */
export const useNews = (category = null) => {
  const fetchNews = async () => {
    try {
      // Note: You'll need a valid API key for these services
      // For NewsAPI (requires API key): https://newsapi.org/
      // For demo purposes, you might prefer using free RSS feeds or MediaStack

      // Example with NewsAPI:
      // const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
      // const keywords = SEARCH_KEYWORDS.join(' OR ');
      // const url = `https://newsapi.org/v2/everything?q=${keywords}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${API_KEY}`;
      
      // const { data } = await axios.get(url);
      
      // return data.articles.map(article => ({
      //   id: article.url,
      //   title: article.title,
      //   source: article.source.name,
      //   url: article.url,
      //   publishedAt: article.publishedAt,
      //   isBreaking: article.title.toLowerCase().includes('breaking') || 
      //              (new Date(article.publishedAt) > new Date(Date.now() - 3600000)),
      //   category: determineCategory(article.title)
      // }));
      
      // For demo purposes, we'll return fallback news
      return FALLBACK_NEWS;
    } catch (error) {
      console.error('Error fetching news:', error);
      return FALLBACK_NEWS;
    }
  };
  
  // Determine news category based on headline keywords
  const determineCategory = (title) => {
    const lowercase = title.toLowerCase();
    if (lowercase.includes('nuclear') || lowercase.includes('atomic')) return 'nuclear';
    if (lowercase.includes('missile') || lowercase.includes('icbm') || lowercase.includes('rocket')) return 'military';
    if (lowercase.includes('climate') || lowercase.includes('warming')) return 'climate';
    if (lowercase.includes('diplomacy') || lowercase.includes('treaty') || lowercase.includes('agreement')) return 'diplomacy';
    if (lowercase.includes('ai') || lowercase.includes('intelligence') || lowercase.includes('cyber')) return 'technology';
    return 'general';
  };

  return useQuery(['news', category], fetchNews, {
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
    cacheTime: 600000, // 10 minutes
    retry: 1,
    select: data => category ? data.filter(article => article.category === category) : data,
    initialData: FALLBACK_NEWS,
  });
};

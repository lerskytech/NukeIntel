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
 * Uses NewsAPI with fallback to GNews or static data
 */
export const useNews = (category = null) => {
  const fetchNews = async () => {
    try {
      // Try to get the API key from environment variables
      const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
      const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
      
      // If NewsAPI key is available, try that first
      if (NEWS_API_KEY) {
        try {
          // Format keywords for API query
          const keywords = encodeURIComponent(SEARCH_KEYWORDS.join(' OR '));
          
          // Use NewsAPI to fetch real articles
          const url = `https://newsapi.org/v2/everything?q=${keywords}&sortBy=publishedAt&language=en&pageSize=25&apiKey=${NEWS_API_KEY}`;
          
          console.log('Fetching news from NewsAPI...');
          const { data } = await axios.get(url);
          
          // If we got articles, format and return them
          if (data.articles && data.articles.length > 0) {
            console.log(`Successfully fetched ${data.articles.length} articles from NewsAPI`);
            
            return data.articles.map(article => ({
              id: article.url,
              title: article.title,
              description: article.description,
              source: article.source.name,
              url: article.url,
              publishedAt: article.publishedAt,
              imageUrl: article.urlToImage,
              isBreaking: article.title.toLowerCase().includes('breaking') || 
                        (new Date(article.publishedAt) > new Date(Date.now() - 7200000)), // 2 hours
              category: determineCategory(article.title + ' ' + (article.description || ''))
            }));
          }
        } catch (newsApiError) {
          console.error('Error fetching from NewsAPI:', newsApiError);
        }
      }
      
      // Try GNews as a backup option
      if (GNEWS_API_KEY) {
        try {
          // Try with GNews API as an alternative
          const keywords = encodeURIComponent(SEARCH_KEYWORDS.slice(0, 5).join(' OR ')); // GNews has query length limits
          
          const gnewsUrl = `https://gnews.io/api/v4/search?q=${keywords}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
          
          console.log('Falling back to GNews API...');
          const { data } = await axios.get(gnewsUrl);
          
          if (data.articles && data.articles.length > 0) {
            console.log(`Successfully fetched ${data.articles.length} articles from GNews`);
            
            return data.articles.map(article => ({
              id: article.url,
              title: article.title,
              description: article.description,
              source: article.source.name,
              url: article.url,
              publishedAt: article.publishDate,
              imageUrl: article.image,
              isBreaking: article.title.toLowerCase().includes('breaking') || 
                        (new Date(article.publishDate) > new Date(Date.now() - 7200000)), // 2 hours
              category: determineCategory(article.title + ' ' + (article.description || ''))
            }));
          }
        } catch (gnewsError) {
          console.error('Error fetching from GNews:', gnewsError);
        }
      }
      
      console.warn('No news data available from APIs. Using fallback news data.');
      return FALLBACK_NEWS;
      
    } catch (error) {
      console.error('Error in news fetching process:', error);
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

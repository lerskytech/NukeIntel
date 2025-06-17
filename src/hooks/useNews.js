import { useQuery } from 'react-query';
import axios from 'axios';

/**
 * Keywords to search for when fetching news
 * Related to nuclear threats, global catastrophe, etc.
 */
const SEARCH_KEYWORDS = [
  'nuclear weapon', 'atomic', 'doomsday', 'nuclear threat',
  'nuclear missile', 'nuclear test', 'nuclear arsenal',
  'atomic scientists', 'nuclear war', 'nuclear attack',
  'fallout', 'radiation', 'uranium', 'plutonium',
  'nuclear proliferation', 'nuclear deterrence', 'treaty',
  'climate catastrophe', 'climate emergency', 'extinction',
  'global catastrophe', 'existential risk', 'apocalypse',
  'nuclear treaty', 'arms control', 'doomsday clock',
  'radiation leak', 'nuclear power', 'nuclear accident',
  'nuclear disaster', 'ICBM', 'ballistic missile',
  'hydrogen bomb', 'nuclear winter', 'mutually assured destruction', 
  'nuclear command', 'strategic forces', 'nuclear policy',
  'nuclear posture', 'first strike', 'second strike',
  'nuclear silo', 'missile defense', 'nuclear submarine',
  'radiation fallout', 'uranium enrichment', 'centrifuge',
  'plutonium production', 'nuclear facility', 'strategic bomber',
  'tactical nuclear', 'kiloton', 'megaton', 'warhead',
  'nuclear stockpile', 'disarmament', 'bulletin atomic',
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
          
          // If we got articles, validate and filter them first
          if (data.articles && data.articles.length > 0) {
            // Filter out articles with no URL or invalid URLs
            const validArticles = data.articles.filter(article => {
              return article.url && 
                typeof article.url === 'string' && 
                article.url.startsWith('http') &&
                article.title && 
                article.source && 
                article.source.name;
            });
            
            console.log(`Successfully fetched ${validArticles.length} valid articles from NewsAPI`);
            
            if (validArticles.length === 0) {
              console.warn('No valid articles found in NewsAPI response');
              return null; // Continue to next source
            }
            
            return validArticles.map(article => ({
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
            // Filter out articles with no URL or invalid URLs
            const validArticles = data.articles.filter(article => {
              return article.url && 
                typeof article.url === 'string' && 
                article.url.startsWith('http') &&
                article.title && 
                article.source && 
                article.source.name;
            });
            
            console.log(`Successfully fetched ${validArticles.length} valid articles from GNews`);
            
            if (validArticles.length === 0) {
              console.warn('No valid articles found in GNews response');
              return [];
            }
            
            return validArticles.map(article => ({
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
      
      console.warn('No news data available from APIs.');
      return []; // Return empty array instead of fallbacks to ensure only real news
      
    } catch (error) {
      console.error('Error in news fetching process:', error);
      return []; // Return empty array instead of fallbacks to ensure only real news
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

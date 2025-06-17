/**
 * Service to extract and suggest relevant keywords from news articles
 * These keywords can be used for sharing on social media and enhancing engagement
 */

// Common nuclear and global threat keywords
const COMMON_KEYWORDS = {
  nuclear: [
    'nuclear', 'atomic', 'radioactive', 'uranium', 'plutonium', 'reactor', 'fallout',
    'deterrence', 'nonproliferation', 'arms control', 'disarmament'
  ],
  military: [
    'military', 'missile', 'weapon', 'war', 'defense', 'army', 'navy', 'air force',
    'conflict', 'security', 'tactical', 'strategic', 'strike'
  ],
  climate: [
    'climate', 'global warming', 'carbon', 'emission', 'environment', 'temperature',
    'greenhouse', 'sea level', 'pollution', 'sustainability', 'renewable'
  ],
  diplomacy: [
    'diplomacy', 'treaty', 'united nations', 'agreement', 'summit', 'peace',
    'international', 'bilateral', 'negotiation', 'alliance', 'cooperation'
  ],
  technology: [
    'technology', 'ai', 'cyber', 'artificial intelligence', 'quantum', 'digital',
    'robotics', 'algorithm', 'automation', 'surveillance', 'computing'
  ]
};

// Trending keywords that get updated periodically
// In a real implementation, these would come from an API
const TRENDING_KEYWORDS = [
  'DoomsdayClock', 'NuclearRisk', 'ClimateAction',
  'GlobalSecurity', 'NukeIntel', 'ThreatMonitor',
  'ArmsTreaty', 'EmergingThreats', 'ScienceDiplomacy'
];

/**
 * Extract keywords from article text
 * @param {Object} article - News article object
 * @returns {Array} - Array of keywords
 */
export const extractKeywords = (article) => {
  if (!article) return [];
  
  const text = [
    article.title || '',
    article.description || '',
    article.source || ''
  ].join(' ').toLowerCase();
  
  const keywords = [];
  
  // Add category as primary keyword if available
  if (article.category) {
    keywords.push(article.category);
  }
  
  // Add matching common keywords
  Object.values(COMMON_KEYWORDS).flat().forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      // Extract multi-word keywords properly
      const parts = keyword.split(' ');
      if (parts.length > 1) {
        keywords.push(keyword.replace(/\s+/g, ''));
      } else {
        keywords.push(keyword);
      }
    }
  });
  
  // Add relevant trending keywords (simulating relevance checking)
  // In a real implementation, this would use NLP or an API
  TRENDING_KEYWORDS.slice(0, 3).forEach(keyword => {
    if (!keywords.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  // Return unique keywords
  return [...new Set(keywords)].slice(0, 5);
};

/**
 * Fetch trending keywords related to an article
 * In a production environment, this would call an external API
 * @param {Object} article - News article object
 * @returns {Promise<Array>} - Promise resolving to array of keywords
 */
export const fetchRelatedKeywords = async (article) => {
  // Extract local keywords first
  const extractedKeywords = extractKeywords(article);
  
  try {
    // In a real implementation, you would make an API call here
    // For now, we'll simulate an API response with a mix of extracted and trending keywords
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(extractedKeywords);
      }, 300);
    });
  } catch (error) {
    console.error('Error fetching related keywords:', error);
    return extractedKeywords; // Fallback to extracted keywords
  }
};

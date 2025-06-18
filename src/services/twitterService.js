import { db, isDevelopment } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore';

// Mock data for development mode
const MOCK_TWEETS = [
  {
    id: 'mock-tweet-1',
    author: '@nukeintelnews',
    handle: 'nukeintelnews',
    content: 'BREAKING: New intelligence report warns of emerging nuclear threats in Asia-Pacific region. Analysis indicates increased missile testing activity. #NukeIntel #NuclearSecurity',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    followers: 158000,
    verified: true,
    profileImage: 'https://i.pravatar.cc/150?img=1',
    source: 'nukeintelnews',
    hashtags: ['NukeIntel', 'NuclearSecurity']
  },
  {
    id: 'mock-tweet-2',
    author: 'Arms Control Today',
    handle: 'armscontrolnow',
    content: 'Our latest analysis on the Doomsday Clock remaining at 90 seconds to midnight. Experts cite ongoing nuclear modernization programs as key factor. #NukeIntel #DoomsdayClock',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    followers: 75000,
    verified: true,
    profileImage: 'https://i.pravatar.cc/150?img=2',
    hashtags: ['NukeIntel', 'DoomsdayClock']
  },
  {
    id: 'mock-tweet-3',
    author: 'Nuclear Security Forum',
    handle: 'nuksecforum',
    content: 'New report on AI integration with nuclear command and control systems raises important questions about human oversight and decision making. #NukeIntel #AI',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    followers: 92000,
    verified: true,
    profileImage: 'https://i.pravatar.cc/150?img=3',
    hashtags: ['NukeIntel', 'AI']
  },
  {
    id: 'mock-tweet-4',
    author: 'Dr. Emma Richards',
    handle: 'DrEmmaRichards',
    content: 'Just published: "Quantifying Nuclear Risk in the Modern Era" - a comprehensive analysis of current global nuclear postures and their implications. #NukeIntel #NuclearRisk',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    followers: 63000,
    verified: true,
    profileImage: 'https://i.pravatar.cc/150?img=4',
    hashtags: ['NukeIntel', 'NuclearRisk']
  },
  {
    id: 'mock-tweet-5',
    author: 'Global Security Initiative',
    handle: 'globalsecorg',
    content: 'Our team is tracking developments in submarine-launched hypersonic missile technology. New capabilities could significantly alter strategic stability calculations. #NukeIntel #nuclear',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    followers: 120000,
    verified: true,
    profileImage: 'https://i.pravatar.cc/150?img=5',
    hashtags: ['NukeIntel', 'nuclear']
  }
];

// Mock user posts
const MOCK_USER_POSTS = [
  {
    id: 'mock-user-post-1',
    author: 'Demo User',
    handle: 'nukeintelfan',
    content: 'Just attended the virtual nuclear policy seminar. Great insights on nonproliferation treaties! #NukeIntel',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    followers: 120,
    verified: false,
    profileImage: 'https://via.placeholder.com/150',
    userId: 'mock-user-123'
  }
];

/**
 * Service for Twitter integration
 * Fetches tweets from Twitter API and caches them in Firestore
 * Also works as a backup store for user-created NukeIntel blog posts
 */

/**
 * Fetch tweets from @nukeintelnews
 * @param {number} count - Number of tweets to fetch
 */
export const fetchNukeIntelNews = async (count = 10) => {
  // Return mock data in development mode
  if (isDevelopment) {
    console.log('Using mock tweet data for @nukeintelnews');
    return MOCK_TWEETS.filter(tweet => tweet.source === 'nukeintelnews').slice(0, count);
  }
  
  try {
    // In a production app, we'd call the Twitter API directly
    // Here we'll fetch from our Firestore cache since direct Twitter API access requires API keys
    const tweetsRef = collection(db, 'cached_tweets');
    const q = query(
      tweetsRef, 
      where('source', '==', 'nukeintelnews'),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching NukeIntel news tweets:', error);
    // Return mock data as fallback
    return MOCK_TWEETS.filter(tweet => tweet.source === 'nukeintelnews').slice(0, count);
  }
};

/**
 * Fetch tweets with #NukeIntel hashtag
 * @param {number} count - Number of tweets to fetch
 * @param {boolean} onlyVerified - Only fetch verified accounts
 */
export const fetchNukeIntelHashtag = async (count = 20, onlyVerified = false) => {
  // Return mock data in development mode
  if (isDevelopment) {
    console.log('Using mock tweet data for #NukeIntel hashtag');
    let mockResults = MOCK_TWEETS.filter(tweet => 
      tweet.hashtags && tweet.hashtags.includes('NukeIntel')
    );
    
    if (onlyVerified) {
      mockResults = mockResults.filter(tweet => tweet.verified);
    }
    
    return mockResults.slice(0, count);
  }
  
  try {
    // In a production app, this would call Twitter API with hashtag search
    // Here we'll fetch from our Firestore cache
    let q = query(
      collection(db, 'cached_tweets'),
      where('hashtags', 'array-contains', 'NukeIntel'),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    
    if (onlyVerified) {
      q = query(q, where('verified', '==', true));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching #NukeIntel tweets:', error);
    // Return mock data as fallback
    let mockResults = MOCK_TWEETS.filter(tweet => 
      tweet.hashtags && tweet.hashtags.includes('NukeIntel')
    );
    if (onlyVerified) {
      mockResults = mockResults.filter(tweet => tweet.verified);
    }
    return mockResults.slice(0, count);
  }
};

/**
 * Post a new tweet/blog post to the system
 * @param {Object} post - The post data
 */
export const createNukeIntelPost = async (post) => {
  // Handle in development mode with mock data
  if (isDevelopment) {
    console.log('Creating mock post in development mode');
    const mockPost = {
      id: `mock-post-${Date.now()}`,
      ...post,
      hashtags: ['NukeIntel'],
      timestamp: new Date().toISOString(),
    };
    
    // Add to mock posts in-memory
    MOCK_USER_POSTS.unshift(mockPost);
    return mockPost;
  }
  
  try {
    // In production, this would also post to Twitter if permissions allow
    // For now, just save to Firestore
    const docRef = await addDoc(collection(db, 'user_posts'), {
      ...post,
      hashtags: ['NukeIntel'],
      timestamp: new Date().toISOString(),
    });
    
    return {
      id: docRef.id,
      ...post,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating NukeIntel post:', error);
    
    // Even in production, return a mock post on error so UX isn't broken
    const fallbackPost = {
      id: `error-recovery-${Date.now()}`,
      ...post,
      hashtags: ['NukeIntel'],
      timestamp: new Date().toISOString(),
    };
    return fallbackPost;
  }
};

/**
 * Fetch featured posts (high follower count accounts)
 * @param {number} minFollowers - Minimum follower count
 * @param {number} count - Number of posts to fetch
 */
export const fetchFeaturedNukeIntelPosts = async (minFollowers = 50000, count = 5) => {
  // Return mock data in development mode
  if (isDevelopment) {
    console.log('Using mock featured posts data');
    return MOCK_TWEETS
      .filter(tweet => tweet.followers >= minFollowers && 
               tweet.hashtags && tweet.hashtags.includes('NukeIntel'))
      .sort((a, b) => b.followers - a.followers)
      .slice(0, count);
  }
  
  try {
    const tweetsRef = collection(db, 'cached_tweets');
    const q = query(
      tweetsRef,
      where('followers', '>=', minFollowers),
      where('hashtags', 'array-contains', 'NukeIntel'),
      orderBy('followers', 'desc'),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching featured NukeIntel posts:', error);
    
    // Return mock data as fallback
    return MOCK_TWEETS
      .filter(tweet => tweet.followers >= minFollowers)
      .sort((a, b) => b.followers - a.followers)
      .slice(0, count);
  }
};

/**
 * Fetch user's posts
 * @param {string} userId - The user's ID
 */
export const fetchUserPosts = async (userId) => {
  // Return mock data in development mode
  if (isDevelopment) {
    console.log('Using mock user posts data for userId:', userId);
    return MOCK_USER_POSTS.filter(post => post.userId === userId);
  }
  
  try {
    const postsRef = collection(db, 'user_posts');
    const q = query(
      postsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user posts:', error);
    // For smoother UX, show mock posts in case of error
    if (userId === 'mock-user-123') {
      return MOCK_USER_POSTS;
    }
    return [];
  }
};

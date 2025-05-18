/**
 * Database configuration and connection handling
 */
const { supabase, checkConnection } = require('./supabase');

/**
 * Initialize database connection
 * @returns {Promise<boolean>} Connection success
 */
const connectDB = async () => {
  try {
    const connected = await checkConnection();
    
    if (!connected) {
      throw new Error('Failed to connect to Supabase');
    }
    
    console.log('Database connection established');
    return true;
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    return false;
  }
};

/**
 * Seed the database with initial sample data (for development/demo purposes)
 */
const seedDatabase = async () => {
  try {
    console.log('Checking if database needs seeding...');
    
    // Check if products already exist
    const { data: existingProducts, error: countError } = await supabase
      .from('products')
      .select('id');
    
    if (countError) {
      throw countError;
    }
    
    if (existingProducts.length === 0) {
      console.log('Seeding database with sample products...');
      
      // Sample products
      const sampleProducts = [
        {
          name: 'Eco-Friendly Smartphone',
          description: 'Made with recycled materials and designed for easy repair and recycling at end of life.',
          category: 'Electronics',
          materials: ['Recycled Aluminum', 'Recycled Plastic', 'Glass'],
          manufacturing_location: 'Germany',
          additional_details: 'This phone is designed to be easily repaired with modular components and minimal adhesives.',
          image_url: 'https://via.placeholder.com/300x200?text=Eco+Phone'
        },
        {
          name: 'Organic Cotton T-Shirt',
          description: 'Made with 100% organic cotton grown without harmful pesticides or synthetic fertilizers.',
          category: 'Clothing',
          materials: ['Organic Cotton'],
          manufacturing_location: 'Portugal',
          additional_details: 'GOTS certified organic cotton. Dyed using low-impact, non-toxic dyes.',
          image_url: 'https://via.placeholder.com/300x200?text=Organic+Shirt'
        },
        {
          name: 'Bamboo Kitchen Utensils',
          description: 'Sustainable bamboo kitchen utensils that are biodegradable and renewable.',
          category: 'Home Goods',
          materials: ['Bamboo'],
          manufacturing_location: 'Vietnam',
          additional_details: 'Made from fast-growing bamboo harvested from sustainable forests.',
          image_url: 'https://via.placeholder.com/300x200?text=Bamboo+Utensils'
        },
        {
          name: 'Solar-Powered Power Bank',
          description: 'Charge your devices using clean solar energy. Includes recycled components.',
          category: 'Electronics',
          materials: ['Recycled Plastic', 'Silicon', 'Lithium Battery'],
          manufacturing_location: 'China',
          additional_details: 'Solar panel converts sunlight to electricity. Battery is recyclable at end of life.',
          image_url: 'https://via.placeholder.com/300x200?text=Solar+Power+Bank'
        },
        {
          name: 'Plant-Based Laundry Detergent',
          description: 'Biodegradable laundry detergent made from plant-derived ingredients.',
          category: 'Home Goods',
          materials: ['Plant Extracts', 'Natural Enzymes'],
          manufacturing_location: 'USA',
          additional_details: 'Free from phosphates, optical brighteners, and synthetic fragrances.',
          image_url: 'https://via.placeholder.com/300x200?text=Eco+Detergent'
        },
        {
          name: 'Recycled Paper Notebook',
          description: '100% recycled paper notebook with vegetable-based ink printing.',
          category: 'Home Goods',
          materials: ['Recycled Paper', 'Vegetable Ink'],
          manufacturing_location: 'Canada',
          additional_details: 'FSC certified recycled paper. Carbon-neutral manufacturing process.',
          image_url: 'https://via.placeholder.com/300x200?text=Recycled+Notebook'
        }
      ];
      
      // Insert products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .insert(sampleProducts)
        .select();
      
      if (productsError) {
        throw productsError;
      }
      
      console.log(`${products.length} sample products inserted`);
      
      // Create sample analyses for the first two products
      if (products.length > 1) {
        const sampleAnalyses = [
          {
            product_id: products[0].id,
            product_description: products[0].description,
            carbon_score: 8,
            water_score: 7,
            resources_score: 9,
            overall_score: 8,
            explanation: 'This smartphone demonstrates strong environmental credentials through its use of recycled materials, modular design for repairability, and manufacturing powered by renewable energy. The recycled aluminum casing significantly reduces the carbon footprint compared to virgin aluminum.',
            suggestions: 'To further improve environmental performance, the manufacturer could: 1. Increase the percentage of recycled materials in components. 2. Implement more water-efficient manufacturing processes. 3. Use biodegradable or compostable materials for more components.',
            raw_analysis: 'Full analysis text would be here in a real implementation.'
          },
          {
            product_id: products[1].id,
            product_description: products[1].description,
            carbon_score: 9,
            water_score: 6,
            resources_score: 8,
            overall_score: 8,
            explanation: 'The organic cotton T-shirt has excellent carbon footprint due to the absence of synthetic fertilizers and pesticides. Water usage remains a challenge as cotton is water-intensive, but organic farming improves soil health and water retention.',
            suggestions: 'Improvements could include: 1. Using rain-fed cotton to reduce irrigation needs. 2. Implementing more water-efficient dyeing processes. 3. Exploring blends with less water-intensive fibers.',
            raw_analysis: 'Full analysis text would be here in a real implementation.'
          }
        ];
        
        const { error: analysesError } = await supabase
          .from('analyses')
          .insert(sampleAnalyses);
        
        if (analysesError) {
          throw analysesError;
        }
        
        console.log(`2 sample analyses inserted`);
      }
    } else {
      console.log('Database already contains products, skipping seed...');
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};

module.exports = {
  supabase,
  connectDB,
  seedDatabase
};
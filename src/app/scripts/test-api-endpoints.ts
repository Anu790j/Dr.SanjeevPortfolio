// src/scripts/test-api-endpoints.ts
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

// Define types
interface Professor {
  name: string;
  [key: string]: any;
}

interface Publication {
  title: string;
  [key: string]: any;
}

interface Project {
  title: string;
  [key: string]: any;
}

interface Course {
  title: string;
  [key: string]: any;
}

async function testEndpoints() {
  try {
    console.log('Testing API endpoints...');
    
    // Test professor endpoint
    console.log('\nTesting /api/professor...');
    const professorRes = await fetch(`${BASE_URL}/professor`);
    console.log(`Status: ${professorRes.status}`);
    const professorData = await professorRes.json() as Professor;
    console.log('Professor data:', professorData.name);
    
    // Test publications endpoint
    console.log('\nTesting /api/publication...');
    const publicationsRes = await fetch(`${BASE_URL}/publication`);
    console.log(`Status: ${publicationsRes.status}`);
    const publicationsData = await publicationsRes.json() as Publication[];
    console.log(`Found ${publicationsData.length} publications`);
    if (publicationsData.length > 0) {
      console.log('First publication:', publicationsData[0].title);
    }
    
    // Test projects endpoint
    console.log('\nTesting /api/projects...');
    const projectsRes = await fetch(`${BASE_URL}/projects`);
    console.log(`Status: ${projectsRes.status}`);
    const projectsData = await projectsRes.json() as Project[];
    console.log(`Found ${projectsData.length} projects`);
    if (projectsData.length > 0) {
      console.log('First project:', projectsData[0].title);
    }
    
    // Test courses endpoint
    console.log('\nTesting /api/course...');
    const coursesRes = await fetch(`${BASE_URL}/course`);
    console.log(`Status: ${coursesRes.status}`);
    const coursesData = await coursesRes.json() as Course[];
    console.log(`Found ${coursesData.length} courses`);
    if (coursesData.length > 0) {
      console.log('First course:', coursesData[0].title);
    }
    
    console.log('\nAPI tests completed!');
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Run the tests
testEndpoints();
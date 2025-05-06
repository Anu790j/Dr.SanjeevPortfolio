// src/scripts/seed-test-data.ts
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Professor from '@/models/Professor';
import Publication from '@/models/Publication';
import Project from '@/models/Project';
import Course from '@/models/Course';

async function seedData() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connection established.');
    console.log('Connection status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected');
    console.log('Connection URI:', mongoose.connection.host);
    console.log('Database name:', mongoose.connection.db?.databaseName || 'unknown');
    
    // Clear existing data
    await Professor.deleteMany({});
    await Publication.deleteMany({});
    await Project.deleteMany({});
    await Course.deleteMany({});
    
    console.log('Seeding professor data...');
    await Professor.create({
      name: 'Dr. Sanjeev Manhas',
      title: 'Professor, Microelectronics & VLSI',
      email: 'manhas@iitr.ac.in',
      phone: '+91-1332-285082',
      office: 'ECE Department, IIT Roorkee',
      department: 'Electronics and Communication Engineering',
      university: 'Indian Institute of Technology Roorkee',
      bio: 'Leading researcher in micro/nanoelectronics with focus on semiconductor device modeling, simulation, fabrication and characterization.',
      education: [
        { degree: 'Ph.D. in Microelectronics', institution: 'IIT Delhi', year: 2002 },
        { degree: 'M.Tech in Solid State Materials', institution: 'IIT Delhi', year: 1998 },
        { degree: 'B.E. in Electronics & Communication Engineering', institution: 'University of Roorkee', year: 1996 }
      ],
      researchInterests: [
        'Micro/Nanoelectronics Device Modeling',
        'Semiconductor Device Fabrication',
        'Compact Model Development for Circuit Simulation',
        'Nanoscale CMOS Devices and Technology'
      ]
    });
    
    console.log('Seeding publications data...');
    const publicationsSample = [
      {
        title: "Analysis and Modeling of Drain Current Characteristics in Nanoscale SOI MOSFET",
        authors: "S. Manhas, M. Singh, D. Sharma",
        journal: "IEEE Transactions on Electron Devices",
        year: 2022,
        doi: "10.1109/TED.2022.1234567",
        tags: ["modeling", "SOI", "MOSFET"]
      },
      {
        title: "Compact Model for Tunnel FET with Gate Overlap for Circuit Simulation",
        authors: "A. Kumar, S. Manhas, P. Singh",
        journal: "Solid-State Electronics",
        year: 2021,
        doi: "10.1016/j.sse.2021.987654",
        tags: ["TFET", "compact model", "simulation"]
      },
      {
        title: "Design and Fabrication of High-k Gate Dielectric MOSFET",
        authors: "S. Manhas, R. Gupta, V. Kumar",
        journal: "IEEE Electron Device Letters",
        year: 2020,
        doi: "10.1109/LED.2020.5678910",
        tags: ["fabrication", "high-k", "dielectric"]
      }
    ];
    await Publication.insertMany(publicationsSample);
    
    console.log('Seeding projects data...');
    const projectsSample = [
      {
        title: "VLSI Design and Fabrication Lab",
        description: "State-of-the-art laboratory for designing and fabricating integrated circuits.",
        category: "lab",
        highlights: [
          "Complete VLSI design flow capabilities",
          "Industry collaboration opportunities",
          "Hands-on training for students"
        ],
        order: 1
      },
      {
        title: "Nano-Scale Device Characterization",
        description: "Research project focused on characterizing and modeling nano-scale semiconductor devices.",
        category: "research",
        highlights: [
          "Novel measurement techniques for sub-10nm devices",
          "Parameter extraction methodologies",
          "Physics-based compact modeling"
        ],
        order: 2
      }
    ];
    await Project.insertMany(projectsSample);
    
    console.log('Seeding courses data...');
    const coursesSample = [
      {
        code: "ECE305",
        title: "Advanced VLSI Design",
        description: "Advanced concepts in VLSI design including low-power techniques and high-performance circuit design.",
        level: "Graduate",
        semester: "Fall",
        year: 2023,
        highlights: [
          "Industry-standard EDA tools for design and simulation",
          "Hands-on lab sessions for practical implementation",
          "Final project on designing a complete integrated circuit"
        ],
        order: 1
      },
      {
        code: "ECE201",
        title: "Microelectronics Devices and Circuits",
        description: "Fundamentals of semiconductor devices and their application in electronic circuits.",
        level: "Undergraduate",
        semester: "Spring",
        year: 2023,
        highlights: [
          "Device physics and operation principles",
          "Circuit analysis and design techniques",
          "Laboratory component for practical experience"
        ],
        order: 2
      }
    ];
    await Course.insertMany(coursesSample);
    
    console.log('Test data seeded successfully!');
    
    // Close the connection
    const mongooseInstance = await dbConnect();
    await mongooseInstance.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Failed to seed test data:', error);
  }
}

seedData();
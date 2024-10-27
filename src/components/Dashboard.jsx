import { useState, useEffect } from 'react'
import { Skull, Calendar, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'  // Import the Firestore instance


const Pumpkin = ({ style }) => (
  <div className="pumpkin" style={style}>
    🎃
  </div>
);

const Fog = () => (
  <div className="fog-container pointer-events-none">
    <div className="fog" style={{animationDuration: '40s'}}></div>
    <div className="fog" style={{animationDuration: '30s', animationDirection: 'reverse'}}></div>
  </div>
);  

const CandleLight = () => (
  <div className="candle-light pointer-events-none"></div>
);

const Cloud = ({ style, type, isDarkMode }) => (
  <div className={`cloud cloud-${type} ${isDarkMode ? 'cloud-dark' : ''}`} style={style}></div>
);

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [calls, setCalls] = useState([]);
  const [pumpkins, setPumpkins] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [filterScam, setFilterScam] = useState(false);

  async function lookupCarrier(phoneNumber) {
    try {
      // Format phone number before sending
      let cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
      if (!cleanNumber.startsWith('+')) {
        cleanNumber = cleanNumber.startsWith('1') ? `+${cleanNumber}` : `+1${cleanNumber}`;
      }
      
      console.log('Sending formatted number:', cleanNumber);
      
      const response = await fetch('/api/lookup-carrier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: cleanNumber }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Lookup error:', errorData);
        return 'Unknown';
      }
      
      const data = await response.json();
      // console.log("my data: ", data.)
      return data.carrier || 'Unknown';
    } catch (error) {
      console.error('Error looking up carrier:', error);
      return 'Unknown';
    }
  }

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
    
    
    // Replace the hardcoded setCalls with this function
    const fetchCalls = async () => {
      const callersCollection = collection(db, 'callers');
      const callersSnapshot = await getDocs(callersCollection);
      const callsData = await Promise.all(callersSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        console.log("id: ", doc.id);
        const carrier = await lookupCarrier(doc.id);
        return {
          dateTime: data.time,
          phoneNumber: doc.id,
          carrier: carrier,
          scamLikelihood: data.isScam 
            ? Math.floor(Math.random() * 21) + 80  // 80 to 100 if isScam is true
            : Math.floor(Math.random() * 21) + 10, // 10 to 30 if isScam is false
        };
      }));
      setCalls(callsData);
    };

    fetchCalls();

    const newPumpkins = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animationDelay: `${Math.random() * 2}s`,
      },
    }));
    setPumpkins(newPumpkins);

    const newClouds = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      type: Math.floor(Math.random() * 3) + 1, 
      style: {
        top: `${Math.random() * 70}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 60 + 60}s`, 
        animationDelay: `${Math.random() * -60}s`,
      },
    }));
    setClouds(newClouds);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleFilterScam = () => {
    setFilterScam(!filterScam);
  };

  const filteredCalls = filterScam 
    ? calls.filter(call => call.scamLikelihood > 75)
    : calls.filter(call => call.scamLikelihood <= 75);

  return (
    <div className={`relative p-8 min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-orange-400 text-orange-100'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pumpkins.map((pumpkin) => (
          <Pumpkin key={pumpkin.id} style={pumpkin.style} />
        ))}
        <Fog />
        <CandleLight />
        {clouds.map((cloud) => (
          <Cloud key={cloud.id} style={cloud.style} type={cloud.type} isDarkMode={isDarkMode} />
        ))}
      </div>
      <div className="relative z-10">
        <div className="w-full flex justify-center mb-10">
          <h1 className="text-6xl font-bold text-orange-500 text-outline font-creepster text-center px-4 py-2 bg-black bg-opacity-20 rounded-lg">
            🎃 The Scam Scare Tracker 👻
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className={isDarkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Total Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl mb-2" role="img" aria-label="Phone">📞</span>
              <p className="text-2xl font-bold">{calls.length}</p>
            </CardContent>
          </Card>
          
          <Card className={isDarkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle>High Risk Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <Skull className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-2xl font-bold">{calls.filter(call => call.scamLikelihood > 70).length}</p>
            </CardContent>
          </Card>
          
          <Card className={isDarkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Today's Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{currentDate}</p>
            </CardContent>
          </Card>
          
          <Card className={isDarkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Light/Dark Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white bg-opacity-80'}`}>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Date & Time</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Phone Number</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Carrier</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Scam Likelihood</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call, index) => (
                  <TableRow key={index}>
                    <TableCell>{call.dateTime}</TableCell>
                    <TableCell>{call.phoneNumber}</TableCell>
                    <TableCell>{call.carrier}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded ${getScamColor(call.scamLikelihood)}`}>
                        {call.scamLikelihood}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="flex justify-end mb-4 mt-4">
          <Button variant="outline" onClick={toggleFilterScam}>
            {filterScam ? 'Show Unlikely Scams' : 'Show Likely Scams'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function getScamColor(likelihood) {
  if (likelihood < 30) return "bg-green-600 text-white";
  if (likelihood < 70) return "bg-yellow-600 text-black";
  return "bg-red-600 text-white";
}
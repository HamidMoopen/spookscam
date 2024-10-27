import { useState, useEffect } from 'react'
import { Skull, Calendar, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [calls, setCalls] = useState([]);
  const [pumpkins, setPumpkins] = useState([]);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
    setCalls([
      { dateTime: '2024-10-24 13:45', carrier: 'Verizon', scamLikelihood: 85 },
      { dateTime: '2024-10-25 07:30', carrier: 'T-Mobile', scamLikelihood: 20 },
      { dateTime: '2024-10-35 15:15', carrier: 'AT&T', scamLikelihood: 60 },
    ]);

    const newPumpkins = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animationDelay: `${Math.random() * 2}s`,
      },
    }));
    setPumpkins(newPumpkins);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`relative p-8 min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-orange-400 text-orange-100'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pumpkins.map((pumpkin) => (
          <Pumpkin key={pumpkin.id} style={pumpkin.style} />
        ))}
        <Fog />
        <CandleLight />
      </div>
      <div className="relative z-10">
        <div className="w-full flex justify-center mb-10">
          <h1 className="text-6xl font-bold text-orange-500 text-outline font-creepster text-center px-4 py-2 bg-black bg-opacity-20 rounded-lg">
            🎃 Spooky Call Tracker 👻
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

        <Card className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Date & Time</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Carrier</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Scam Likelihood</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call, index) => (
                  <TableRow key={index}>
                    <TableCell>{call.dateTime}</TableCell>
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
      </div>
    </div>
  );
}

function getScamColor(likelihood) {
  if (likelihood < 30) return "bg-green-600 text-white";
  if (likelihood < 70) return "bg-yellow-600 text-black";
  return "bg-red-600 text-white";
}
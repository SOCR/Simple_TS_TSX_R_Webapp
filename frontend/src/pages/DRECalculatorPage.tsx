import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types
interface FileInfo {
  Name: string;
  Size: number;
}

interface TaskResult {
  scores: Record<string, string | number>[];
  complexity: Record<string, string | number>[];
  radius: Record<string, string | number>[];
  plots: {
    scores: string;
    complexity: string;
    radius: string;
  };
}

interface TaskStatus {
  running: string[];
  stopped: string[];
}

// API Configuration
const API_URL = "http://127.0.0.1:8080";

// Valid CPU and memory combinations
const validCombinations = {
  "256": [512, 1024, 2048],
  "512": [1024, 2048, 3072, 4096],
  "1024": [2048, 3072, 4096, 5120, 6144, 7168, 8192],
  "2048": [4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, 16384],
  "4096": Array.from({ length: 23 }, (_, i) => 8192 + i * 1024)
};

// Generate CPU/memory choices
const cpuMemoryChoices = Object.entries(validCombinations).map(([cpu, memOptions]) => 
  memOptions.map(mem => `${cpu} CPU / ${mem} MB`)
).flat();

export default function DRECalculatorPage() {
  // State
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [originalFile, setOriginalFile] = useState<string>('');
  const [obfuscatedFiles, setObfuscatedFiles] = useState<string[]>([]);
  const [replications, setReplications] = useState<number>(10);
  const [chooseTargets, setChooseTargets] = useState<'random' | 'specified'>('random');
  const [targets, setTargets] = useState<string>('20');
  const [chooseFeatures, setChooseFeatures] = useState<'random' | 'specified'>('random');
  const [complexity, setComplexity] = useState<string>('5');
  const [features, setFeatures] = useState<string[]>([]);
  const [radius, setRadius] = useState<string>('0.1');
  const [outputPrefix, setOutputPrefix] = useState<string>('');
  const [cpuMemoryChoice, setCpuMemoryChoice] = useState<string>(cpuMemoryChoices[14]);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>({ running: [], stopped: [] });
  const [taskResults, setTaskResults] = useState<TaskResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  // Fetch username from environment or use a default
  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || import.meta.env.VITE_DEFAULT_USERNAME || 'user1';
    setUsername(storedUsername);
  }, []);

  // Fetch files on component mount
  useEffect(() => {
    if (username) {
      fetchFiles();
      const interval = setInterval(fetchTaskStatus, 10000); // Poll task status every 10 seconds
      return () => clearInterval(interval);
    }
  }, [username]);

  const fetchFiles = async () => {
    const test = await axios.get(`${API_URL}/dre/test`);
    console.log(test)
    console.log(`${API_URL}/files`)
    try {
      const response = await axios.get(`${API_URL}/dre/files`, {
        params: { username }
      });
      const fileData = Array.isArray(response.data) ? response.data : [];
      console.log(fileData);
      setFiles(fileData);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setError('Failed to load files. Please try again.');
      setFiles([]);
    }
  };

  const fetchTaskStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/dre/get_tasks`);
      setTaskStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch task status:', error);
      setError('Failed to fetch task status. Please try again.');
    }
  };

  const handleRunTask = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/dre/tasks`, {
        original_file: originalFile,
        obfuscated_files: obfuscatedFiles || [],
        replications,
        choose_targets: chooseTargets,
        targets: chooseTargets === 'specified' ? (targets ? targets.split(' ').map(Number) : []) : null,
        choose_features: chooseFeatures,
        complexity: chooseFeatures === 'random' ? (complexity ? complexity.split(' ').map(Number) : []) : null,
        features: chooseFeatures === 'specified' ? (features || []) : null,
        radius: radius ? radius.split(' ').map(Number) : [],
        output_prefix: outputPrefix,
        cpu_memory: cpuMemoryChoice,
        username
      });

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          const resultResponse = await axios.get(`${API_URL}/dre/tasks/${outputPrefix}/results`, {
            params: { username }
          });
          setTaskResults(resultResponse.data);
          clearInterval(pollInterval);
          setIsLoading(false);
        } catch (error) {
          // Task might still be running
          console.log('Task still running...');
        }
      }, 5000);

      // Clear polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsLoading(false);
      }, 300000);

    } catch (error) {
      console.error('Failed to run task:', error);
      setError('Failed to run task. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFileSelection = (fileName: string, checked: boolean) => {
    if (checked) {
      setObfuscatedFiles(prev => [...(prev || []), fileName]);
    } else {
      setObfuscatedFiles(prev => (prev || []).filter(f => f !== fileName));
    }
  };

  const handleFeatureSelection = (feature: string, checked: boolean) => {
    if (checked) {
      setFeatures(prev => [...(prev || []), feature]);
    } else {
      setFeatures(prev => (prev || []).filter(f => f !== feature));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Disclosure Risk Estimator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Panel */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Retrieve Data From S3 Buckets</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchFiles} className="w-full mb-4">
                List Bucket Contents
              </Button>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Original CSV File</label>
                  <Select value={originalFile} onValueChange={setOriginalFile}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select file" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(files) && files.map(file => (
                        <SelectItem key={file.Name} value={file.Name}>
                          {file.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Obfuscated CSV Files</label>
                  <ScrollArea className="h-[200px] border rounded-md p-4">
                    <div className="space-y-2">
                      {Array.isArray(files) && files.map(file => (
                        <div key={file.Name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`file-${file.Name}`}
                            checked={obfuscatedFiles.includes(file.Name)}
                            onCheckedChange={(checked: boolean) => handleFileSelection(file.Name, checked as boolean)}
                          />
                          <Label htmlFor={`file-${file.Name}`}>{file.Name}</Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Replications</label>
                  <Input
                    type="number"
                    value={replications}
                    onChange={(e) => setReplications(Number(e.target.value))}
                    min={1}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Target Selection</label>
                  <Select value={chooseTargets} onValueChange={(value: 'random' | 'specified') => setChooseTargets(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose targets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="specified">Specified Targets</SelectItem>
                    </SelectContent>
                  </Select>
                  {chooseTargets === 'specified' && (
                    <Input
                      value={targets}
                      onChange={(e) => setTargets(e.target.value)}
                      placeholder="Enter target indices (space-separated)"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Feature Selection</label>
                  <Select value={chooseFeatures} onValueChange={(value: 'random' | 'specified') => setChooseFeatures(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose features" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="specified">Specified Features</SelectItem>
                    </SelectContent>
                  </Select>
                  {chooseFeatures === 'random' ? (
                    <Input
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value)}
                      placeholder="Enter complexity values (space-separated)"
                    />
                  ) : (
                    <ScrollArea className="h-[200px] border rounded-md p-4">
                      <div className="space-y-2">
                        {features.map(feature => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Checkbox
                              id={`feature-${feature}`}
                              checked={features.includes(feature)}
                              onCheckedChange={(checked : boolean) => handleFeatureSelection(feature, checked as boolean)}
                            />
                            <Label htmlFor={`feature-${feature}`}>{feature}</Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Radius</label>
                  <Input
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    placeholder="Enter radius values (space-separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Task Output Prefix</label>
                  <Input
                    value={outputPrefix}
                    onChange={(e) => setOutputPrefix(e.target.value)}
                    placeholder="e.g., 0621"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CPU / Memory</label>
                  <Select value={cpuMemoryChoice} onValueChange={setCpuMemoryChoice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CPU/Memory" />
                    </SelectTrigger>
                    <SelectContent>
                      {cpuMemoryChoices.map(choice => (
                        <SelectItem key={choice} value={choice}>
                          {choice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleRunTask}
                  disabled={isLoading || !originalFile || obfuscatedFiles.length === 0 || !outputPrefix}
                  className="w-full"
                >
                  {isLoading ? 'Running Task...' : 'Run Task'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Task Status */}
          <Card>
            <CardHeader>
              <CardTitle>Task Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium">Running Tasks:</h4>
                  <pre className="text-sm">{(taskStatus.running || []).join('\n')}</pre>
                </div>
                <div>
                  <h4 className="font-medium">Stopped Tasks:</h4>
                  <pre className="text-sm">{(taskStatus.stopped || []).join('\n')}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2">
          <Tabs defaultValue="scores">
            <TabsList>
              <TabsTrigger value="scores">Scores</TabsTrigger>
              <TabsTrigger value="plots">Plots</TabsTrigger>
              <TabsTrigger value="distances">Distances</TabsTrigger>
            </TabsList>

            <TabsContent value="scores">
              {taskResults && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(taskResults.scores[0]).map(key => (
                              <TableHead key={key}>{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {taskResults.scores.map((row, i) => (
                            <TableRow key={i}>
                              {Object.values(row).map((value, j) => (
                                <TableCell key={j}>{String(value)}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Complexity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(taskResults.complexity[0]).map(key => (
                              <TableHead key={key}>{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {taskResults.complexity.map((row, i) => (
                            <TableRow key={i}>
                              {Object.values(row).map((value, j) => (
                                <TableCell key={j}>{String(value)}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Radius</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(taskResults.radius[0]).map(key => (
                              <TableHead key={key}>{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {taskResults.radius.map((row, i) => (
                            <TableRow key={i}>
                              {Object.values(row).map((value, j) => (
                                <TableCell key={j}>{String(value)}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="plots">
              {taskResults && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scores Plot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={`data:image/png;base64,${taskResults.plots.scores}`}
                        alt="Scores Plot"
                        className="w-full"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Complexity Plot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={`data:image/png;base64,${taskResults.plots.complexity}`}
                        alt="Complexity Plot"
                        className="w-full"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Radius Plot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={`data:image/png;base64,${taskResults.plots.radius}`}
                        alt="Radius Plot"
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="distances">
              {/* Add distance visualization components here */}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
} 
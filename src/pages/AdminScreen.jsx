import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getGameConfig, saveGameConfig } from "../utils/gameConfigUtils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Upload,
  Plus,
  Trash2,
  Save,
  ImageIcon,
  Target,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminScreen() {
  const [config, setConfig] = useState(getGameConfig());
  // const [imagePath, setImagePath] = useState(config.levels[0].imagePath || "");
  // const [imagePath2, setImagePath2] = useState(
  // config.levels[0].imagePath2 || "");
  const [currentLevelIndex, SetCurrentLevelIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedDifference, setSelectedDifference] = useState(null);

  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);

  const currentLevel = config.levels[currentLevelIndex] || config.levels[0];

  const [differences, setDifferences] = useState(
    config.levels[0].differences || []
  );
  console.log("AdminScreen for level", currentLevel);

  const handleDifferenceChange = (index, field, value) => {
    const updatedLevels = [...config.levels];
    const updated = [...updatedLevels[currentLevelIndex].differences];
    updated[index][field] = Number.parseInt(value) || 0;
    updatedLevels[currentLevelIndex].differences = updated;
    setConfig({ ...config, levels: updatedLevels });
  };

  const addDifference = (x = 0, y = 0) => {
    const updatedLevels = [...config.levels];
    const newDifference = { x, y, width: 50, height: 50 };
    updatedLevels[currentLevelIndex].differences = [
      ...updatedLevels[currentLevelIndex].differences,
      newDifference,
    ];
    setConfig({ ...config, levels: updatedLevels });
  };

  const removeDifference = (index) => {
    const updatedLevels = [...config.levels];
    updatedLevels[currentLevelIndex].differences = updatedLevels[
      currentLevelIndex
    ].differences.filter((_, i) => i !== index);
    setConfig({ ...config, levels: updatedLevels });
  };

  const handleImageUpload = (file, imageNumber) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedLevels = [...config.levels];
        if (imageNumber === 1) {
          updatedLevels[currentLevelIndex].imagePath = e.target.result;
        } else {
          updatedLevels[currentLevelIndex].imagePath2 = e.target.result;
        }
        setConfig({ ...config, levels: updatedLevels });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (event, imageNumber) => {
    if (!previewMode) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates based on actual image size vs display size
    const img = imageNumber === 1 ? imageRef1.current : imageRef2.current;
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const scaledX = Math.round(x * scaleX);
    const scaledY = Math.round(y * scaleY);

    addDifference(scaledX, scaledY);
  };

  const addNewLevel = () => {
    const newLevel = {
      name: `Level ${config.levels.length + 1}`,
      thumbNail: "/images/placeholder.png",
      isCompleted: false,
      isLocked: false,
      imagePath: "",
      imagePath2: "",
      differences: [],
    };
    setConfig({ ...config, levels: [...config.levels, newLevel] });
    setCurrentLevelIndex(config.levels.length);
  };

  const updateLevelName = (name) => {
    const updatedLevels = [...config.levels];
    updatedLevels[currentLevelIndex].name = name;
    setConfig({ ...config, levels: updatedLevels });
  };

  const saveConfig = () => {
    saveGameConfig(config);
    alert("Configuration saved successfully!");
  };

  const renderDifferenceMarkers = (imageNumber) => {
    if (!previewMode) return null;

    return currentLevel.differences.map((diff, index) => (
      <div
        key={index}
        className={`absolute border-2 rounded cursor-pointer transition-all ${
          selectedDifference === index
            ? "border-red-500 bg-red-500/20"
            : "border-green-500 bg-green-500/20"
        }`}
        style={{
          left: `${
            (diff.x /
              (imageNumber === 1
                ? imageRef1.current?.naturalWidth || 1
                : imageRef2.current?.naturalWidth || 1)) *
            100
          }%`,
          top: `${
            (diff.y /
              (imageNumber === 1
                ? imageRef1.current?.naturalHeight || 1
                : imageRef2.current?.naturalHeight || 1)) *
            100
          }%`,
          width: `${
            (diff.width /
              (imageNumber === 1
                ? imageRef1.current?.naturalWidth || 1
                : imageRef2.current?.naturalWidth || 1)) *
            100
          }%`,
          height: `${
            (diff.height /
              (imageNumber === 1
                ? imageRef1.current?.naturalHeight || 1
                : imageRef2.current?.naturalHeight || 1)) *
            100
          }%`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedDifference(selectedDifference === index ? null : index);
        }}
      >
        <div className="absolute -top-6 left-0 bg-black text-white text-xs px-1 rounded">
          {index + 1}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛠️ Spot the Difference - Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage game levels, upload images, and configure difference points
          </p>
          <div className="flex items-end gap-2">
            <Button onClick={saveConfig} variant={"myButton"}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
            <Link to="/">
              <Button variant={"myButton"}>Main Menu</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="levels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="levels">Levels</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="differences">Differences</TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Level Management
                </CardTitle>
                <CardDescription>Create and manage game levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {config.levels.map((level, index) => (
                    <Badge
                      key={index}
                      variant={
                        index === currentLevelIndex ? "default" : "outline"
                      }
                      className="cursor-pointer px-3 py-1"
                      onClick={() => setCurrentLevelIndex(index)}
                    >
                      {level.name}
                    </Badge>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addNewLevel}
                    className="h-6"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Level
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="levelName">Level Name</Label>
                    <Input
                      id="levelName"
                      value={currentLevel.name}
                      onChange={(e) => updateLevelName(e.target.value)}
                      placeholder="Enter level name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Image Upload
                </CardTitle>
                <CardDescription>
                  Upload the two images for comparison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant={previewMode ? "default" : "outline"}
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2"
                  >
                    {previewMode ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                    {previewMode ? "Preview Mode ON" : "Preview Mode OFF"}
                  </Button>
                  {previewMode && (
                    <p className="text-sm text-gray-600">
                      Click on images to add difference points
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image 1 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Image 1</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInput1Ref.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <input
                      ref={fileInput1Ref}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files[0], 1)}
                    />
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      {currentLevel.imagePath ? (
                        <div className="relative">
                          <img
                            ref={imageRef1}
                            src={currentLevel.imagePath || "/placeholder.svg"}
                            alt="Image 1"
                            className={`w-full h-auto max-h-96 object-contain ${
                              previewMode ? "cursor-crosshair" : ""
                            }`}
                            onClick={(e) => handleImageClick(e, 1)}
                          />
                          {renderDifferenceMarkers(1)}
                        </div>
                      ) : (
                        <div className="h-48 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                            <p>No image uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image 2 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Image 2</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInput2Ref.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <input
                      ref={fileInput2Ref}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files[0], 2)}
                    />
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      {currentLevel.imagePath2 ? (
                        <div className="relative">
                          <img
                            ref={imageRef2}
                            src={currentLevel.imagePath2 || "/placeholder.svg"}
                            alt="Image 2"
                            className={`w-full h-auto max-h-96 object-contain ${
                              previewMode ? "cursor-crosshair" : ""
                            }`}
                            onClick={(e) => handleImageClick(e, 2)}
                          />
                          {renderDifferenceMarkers(2)}
                        </div>
                      ) : (
                        <div className="h-48 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                            <p>No image uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="differences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Difference Points
                </CardTitle>
                <CardDescription>
                  Configure the coordinates and dimensions of difference areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Total differences: {currentLevel.differences.length}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addDifference()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Difference
                  </Button>
                </div>

                <div className="space-y-3">
                  {currentLevel.differences.map((point, index) => (
                    <Card
                      key={index}
                      className={`p-4 ${
                        selectedDifference === index
                          ? "ring-2 ring-red-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">Difference {index + 1}</Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeDifference(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <Label htmlFor={`x-${index}`}>X Position</Label>
                          <Input
                            id={`x-${index}`}
                            type="number"
                            value={point.x}
                            onChange={(e) =>
                              handleDifferenceChange(index, "x", e.target.value)
                            }
                            placeholder="X"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`y-${index}`}>Y Position</Label>
                          <Input
                            id={`y-${index}`}
                            type="number"
                            value={point.y}
                            onChange={(e) =>
                              handleDifferenceChange(index, "y", e.target.value)
                            }
                            placeholder="Y"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`width-${index}`}>Width</Label>
                          <Input
                            id={`width-${index}`}
                            type="number"
                            value={point.width}
                            onChange={(e) =>
                              handleDifferenceChange(
                                index,
                                "width",
                                e.target.value
                              )
                            }
                            placeholder="Width"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`height-${index}`}>Height</Label>
                          <Input
                            id={`height-${index}`}
                            type="number"
                            value={point.height}
                            onChange={(e) =>
                              handleDifferenceChange(
                                index,
                                "height",
                                e.target.value
                              )
                            }
                            placeholder="Height"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  {currentLevel.differences.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-2" />
                      <p>No differences configured yet</p>
                      <p className="text-sm">
                        Add some difference points to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

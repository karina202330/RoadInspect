'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Plus,
  Layers,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { SAMPLE_ROAD_IMAGES } from '@/lib/mock/data';
import { DefectType } from '@/types';

function NewInspectionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRoad = searchParams ? searchParams.get('road') : null;
  const { addInspection, runAIAnalysis } = useRoadVision();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Project Information
  const [projectName, setProjectName] = useState('NH-48 Post-Monsoon Surface & Crack Audit');
  const [roadName, setRoadName] = useState('NH-48');
  const [segment, setSegment] = useState('KM 42.000 to KM 68.000 (Section 3)');
  const [location, setLocation] = useState('Mumbai–Pune Corridor, Maharashtra');
  const [inspector, setInspector] = useState('A. Sharma (Lead Pavement Specialist)');
  const [date, setDate] = useState('2026-10-04');
  const [notes, setNotes] = useState('High-speed automated camera vehicle run post heavy rainfalls.');

  useEffect(() => {
    if (queryRoad) {
      setRoadName(queryRoad);
      setProjectName(`${queryRoad} Pavement Distress Survey`);
      if (queryRoad === 'NH-66') {
        setSegment('KM 110.000 to KM 145.000');
        setLocation('Konkan Coastal Corridor, Maharashtra');
      } else if (queryRoad === 'WEH') {
        setSegment('Bandra to Dahisar Toll Plaza');
        setLocation('Mumbai Suburban Expressway, Maharashtra');
      } else if (queryRoad === 'EEH') {
        setSegment('Sion to Majiwada Junction');
        setLocation('Mumbai–Thane Arterial, Maharashtra');
      }
    }
  }, [queryRoad]);

  // Step 2: Images
  const [uploadedImages, setUploadedImages] = useState<
    { id: string; url: string; name: string }[]
  >([
    {
      id: 'IMG-1',
      url: SAMPLE_ROAD_IMAGES.highway1,
      name: 'FRAME_04825_LANE23.jpg',
    },
    {
      id: 'IMG-2',
      url: SAMPLE_ROAD_IMAGES.highway2,
      name: 'FRAME_04850_LANE12.jpg',
    },
    {
      id: 'IMG-3',
      url: SAMPLE_ROAD_IMAGES.highway3,
      name: 'FRAME_04910_FREIGHT.jpg',
    },
  ]);

  // Step 3: Configuration
  const [sensitivity, setSensitivity] = useState<'low' | 'standard' | 'high'>('high');
  const [detectionTypes, setDetectionTypes] = useState<DefectType[]>([
    'pothole',
    'longitudinal_crack',
    'transverse_crack',
    'alligator_crack',
    'road_edge_damage',
    'lane_marking_damage',
    'debris',
  ]);

  const toggleDetectionType = (type: DefectType) => {
    if (detectionTypes.includes(type)) {
      setDetectionTypes((prev) => prev.filter((t) => t !== type));
    } else {
      setDetectionTypes((prev) => [...prev, type]);
    }
  };

  const handleAddSampleImage = () => {
    const newImg = {
      id: `IMG-${Date.now()}`,
      url: SAMPLE_ROAD_IMAGES.highway1,
      name: `ROAD_SAMPLE_${uploadedImages.length + 1}.jpg`,
    };
    setUploadedImages((prev) => [...prev, newImg]);
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleCreateAndRunAI = async () => {
    const inspectionImages = uploadedImages.map((img, idx) => ({
      id: `IMG-${Date.now()}-${idx}`,
      inspectionId: '',
      url: img.url,
      name: img.name,
      chainage: `KM ${(48 + idx * 0.25).toFixed(3)}`,
      chainageMeters: (idx + 1) * 75,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      gps: { lat: 18.7512 + idx * 0.002, lng: 73.415 + idx * 0.003 },
      speed: '64.5 km/h',
      lane: 'Eastbound Lanes 1 & 2',
      defects: [],
    }));

    const newId = addInspection({
      projectName,
      roadName,
      segment,
      location,
      inspector,
      inspectorAvatar: inspector.split(' ')[0],
      date,
      status: 'processing',
      imageCount: uploadedImages.length * 48,
      sensitivity,
      notes,
      images: inspectionImages,
    });

    // Run AI pipeline
    router.push(`/inspections/${newId}`);
    setTimeout(() => {
      runAIAnalysis(newId, { sensitivity });
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/inspections"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Inspections</span>
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create New Road Inspection Project
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure metadata, ingest pavement imagery and execute AI defect detection pipeline.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step === s
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : step > s
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle">
        {/* STEP 1: Project Information */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 1 — Highway & Project Metadata
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Define the surveyed road segment, jurisdiction and lead pavement engineer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Inspection Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Highway / Road Designation
                </label>
                <select
                  value={roadName}
                  onChange={(e) => setRoadName(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="NH-48">NH-48 (Mumbai–Pune Expressway)</option>
                  <option value="NH-66">NH-66 (Coastal Highway)</option>
                  <option value="WEH">Western Express Highway (Mumbai)</option>
                  <option value="EEH">Eastern Express Highway (Thane)</option>
                  <option value="SH-73">State Highway 73 (Palghar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Road Segment / Chainage Range
                </label>
                <input
                  type="text"
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Geographic Location / State
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assigned Lead Inspector
                </label>
                <input
                  type="text"
                  value={inspector}
                  onChange={(e) => setInspector(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Survey Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Field Survey Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <span>Continue to Image Ingestion</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Image Ingestion & Upload */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 2 — High-Resolution Road Imagery Upload
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload survey camera frames (JPG, PNG, WEBP) captured by vehicle inspection rigs.
              </p>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onClick={handleAddSampleImage}
              className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-blue-50/40 hover:bg-blue-50/70 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3">
                Click or Drop Road Frames Here
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Supports up to 4K resolution frames with embedded EXIF telemetry and GPS coordinates.
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Sample Highway Frame</span>
              </button>
            </div>

            {/* Uploaded Thumbnails Preview */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Staged Frames for Computer Vision ({uploadedImages.length})</span>
                <span className="text-slate-400">GPS & Lens Metadata Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-32 object-cover opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white font-mono">
                      Frame #{idx + 1}
                    </div>
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-md bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                      title="Remove Frame"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 p-1.5 text-[10px] text-slate-300 font-mono truncate">
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(3)}
                disabled={uploadedImages.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <span>Proceed to Model Configuration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Model Configuration & Launch */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 3 — AI Vision Inference Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tune sensitivity thresholds and target distress phenotypes for YOLO-v11x models.
              </p>
            </div>

            {/* Sensitivity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Detection Sensitivity Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    key: 'low',
                    label: 'Low Sensitivity',
                    desc: 'Focus exclusively on critical depth cavities and high-hazard fractures.',
                  },
                  {
                    key: 'standard',
                    label: 'Standard (Recommended)',
                    desc: 'Balanced triage capturing routine maintenance needs and safety items.',
                  },
                  {
                    key: 'high',
                    label: 'High Precision / Deep Audit',
                    desc: 'Aggressive detection capturing hairline cracks and paint delamination.',
                  },
                ].map((s) => (
                  <div
                    key={s.key}
                    onClick={() => setSensitivity(s.key as any)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      sensitivity === s.key
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 block">{s.label}</span>
                    <span className="text-[11px] text-slate-500 mt-1 block leading-snug">
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Distress Types */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Active Defect Phenotypes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {[
                  { key: 'pothole', label: 'Potholes & Cavities' },
                  { key: 'transverse_crack', label: 'Transverse Fractures' },
                  { key: 'longitudinal_crack', label: 'Longitudinal Cracking' },
                  { key: 'alligator_crack', label: 'Structural Alligator Cracking' },
                  { key: 'road_edge_damage', label: 'Road Edge & Shoulder Break' },
                  { key: 'lane_marking_damage', label: 'Lane Marking Delamination' },
                  { key: 'debris', label: 'Road Debris & Obstacles' },
                ].map((item) => {
                  const isChecked = detectionTypes.includes(item.key as DefectType);
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleDetectionType(item.key as DefectType)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-blue-300 bg-blue-50/40 text-blue-900 font-semibold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Ready to Execute
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  Launch Automated AI Inspection Run
                </h4>
                <p className="text-xs text-slate-300">
                  Will process {uploadedImages.length} staged frames and generate interactive bounding boxes.
                </p>
              </div>

              <button
                onClick={handleCreateAndRunAI}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold shadow-md shadow-blue-500/40 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Inspection</span>
              </button>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewInspectionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading New Inspection Wizard...</div>}>
      <NewInspectionForm />
    </Suspense>
  );
}

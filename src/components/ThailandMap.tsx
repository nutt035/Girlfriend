'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { thaiProvinces } from '@/data/thai-provinces';
import { MapPin, Star, Heart, Loader2, RefreshCw, Plus, Minus } from 'lucide-react';

interface GeoJSONFeature {
    type: string;
    properties: {
        CHA_NE: string;
        pro_en?: string;
        PRO_EN?: string;
        am_th?: string;
        AM_TH?: string;
        dt_th?: string;
        DT_TH?: string;
        [key: string]: any;
    };
    geometry: any;
}

interface GeoJSONData {
    type: string;
    features: GeoJSONFeature[];
}

interface ThailandMapProps {
    onSelectProvince: (provinceId: string) => void;
    selectedProvinceId: string | null;
}

export const ThailandMap: React.FC<ThailandMapProps> = ({
    onSelectProvince,
    selectedProvinceId
}) => {
    const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
    const [loading, setLoading] = useState(true);
    const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
    const [hoveredDistrictName, setHoveredDistrictName] = useState<string | null>(null);
    const { universeData, selectedYear } = useAppStore();
    const svgRef = useRef<SVGSVGElement>(null);

    // Map province names from GeoJSON to our IDs
    const provinceNameMap = useMemo(() => {
        const map: Record<string, string> = {};
        thaiProvinces.forEach(p => {
            const normalizedName = p.nameEn.replace(/\s/g, '');
            map[normalizedName] = p.id;
        });
        return map;
    }, []);

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                // District level GeoJSON
                const response = await fetch('https://raw.githubusercontent.com/chingchai/OpenGISData-Thailand/master/districts.geojson');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setGeoData(data);
            } catch (error) {
                console.error('Error loading map data:', error);
                // Fallback to provinces
                try {
                    const response = await fetch('https://raw.githubusercontent.com/apisit/thailand.json/master/simplified/thailandWithName.json');
                    const data = await response.json();
                    setGeoData(data);
                } catch (e) {
                    console.error('Final fallback failed', e);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchGeoData();
    }, []);

    // Status data for styling
    const yearData = universeData.years[selectedYear];
    const visitedThisYear = useMemo(() =>
        new Set((yearData?.visitedProvinces || []).map(p => p.provinceId)),
        [yearData, selectedYear]);

    const visitedEver = useMemo(() => {
        const ever = new Set<string>();
        Object.values(universeData.years).forEach(y => {
            (y.visitedProvinces || []).forEach(p => ever.add(p.provinceId));
        });
        return ever;
    }, [universeData]);

    const wishlist = useMemo(() =>
        new Set(universeData.wishlistProvinces || []),
        [universeData.wishlistProvinces]);

    const width = 400;
    const height = 600;

    // D3 Projection and Path Generator
    const { pathGenerator, projection } = useMemo(() => {
        if (!geoData) return { pathGenerator: null, projection: null };

        const proj = d3.geoMercator()
            .center([100.5, 13.5])
            .scale(2000)
            .translate([width / 2, height / 2]);

        const pathGen = d3.geoPath().projection(proj);
        proj.fitSize([width, height], geoData as any);

        return { pathGenerator: pathGen, projection: proj };
    }, [geoData]);

    // Zoom behavior
    const zoom = useMemo(() => {
        return d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 12])
            .on('zoom', (event) => {
                setZoomTransform(event.transform);
            });
    }, []);

    useEffect(() => {
        if (svgRef.current && zoom) {
            d3.select(svgRef.current).call(zoom);
        }
    }, [zoom, loading]);

    const handleZoomIn = () => {
        if (svgRef.current) {
            d3.select(svgRef.current).transition().duration(500).call(zoom.scaleBy, 1.5);
        }
    };

    const handleZoomOut = () => {
        if (svgRef.current) {
            d3.select(svgRef.current).transition().duration(500).call(zoom.scaleBy, 0.7);
        }
    };

    const handleResetZoom = () => {
        if (svgRef.current) {
            d3.select(svgRef.current).transition().duration(750).call(zoom.transform, d3.zoomIdentity);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-pink-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="font-serif italic text-sm">กางแผนที่ (ฉบับลงลึก) อยู่จ้า...</p>
            </div>
        );
    }

    if (!geoData || !pathGenerator) return null;

    return (
        <div className="relative w-full aspect-[2/3] max-h-[75vh] flex items-center justify-center overflow-hidden bg-pink-50/20 rounded-3xl border-2 border-dashed border-pink-100/50 group">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                preserveAspectRatio="xMidYMid meet"
            >
                <g transform={zoomTransform.toString()}>
                    {/* Districts */}
                    {geoData.features.map((feature, i) => {
                        const enName = feature.properties.pro_en || feature.properties.PRO_EN || feature.properties.CHA_NE;
                        const thDistrict = feature.properties.am_th || feature.properties.AM_TH || feature.properties.dt_th || feature.properties.DT_TH;
                        const id = provinceNameMap[enName?.replace(/\s/g, '')];
                        if (!id) return null;

                        const isSelected = selectedProvinceId === id;
                        const isVisitedThisYear = visitedThisYear.has(id);
                        const isVisitedEver = visitedEver.has(id);
                        const isWishlist = wishlist.has(id);

                        let fillColor = "#ffffff";
                        let strokeColor = "#f3f4f6";
                        let strokeWidth = "0.05";

                        if (isVisitedThisYear) {
                            fillColor = "#fb7185";
                            strokeColor = "#e11d48";
                        } else if (isVisitedEver) {
                            fillColor = "#fecdd3";
                            strokeColor = "#fb7185";
                        } else if (isWishlist) {
                            fillColor = "#93c5fd";
                            strokeColor = "#3b82f6";
                        }

                        if (isSelected) {
                            strokeWidth = "0.3";
                            strokeColor = "#db2777";
                            if (isVisitedThisYear) fillColor = "#e11d48";
                        }

                        return (
                            <path
                                key={i}
                                d={pathGenerator(feature as any) || ""}
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                className="transition-colors duration-300"
                                onMouseEnter={() => thDistrict && setHoveredDistrictName(thDistrict)}
                                onMouseLeave={() => setHoveredDistrictName(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectProvince(id);
                                }}
                            />
                        );
                    })}
                </g>
            </svg>

            {/* Instruction Hint */}
            <div className="absolute top-4 left-4 p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-pink-100 text-[10px] text-pink-400 font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                💡 ใช้ 2 นิ้วหรือเมาส์ซูม/ลากดูอำเภอได้นะ
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-pink-100 shadow-sm hover:bg-white text-pink-500 transition-all scale-90 active:scale-75"
                >
                    <Plus className="w-5 h-5" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-pink-100 shadow-sm hover:bg-white text-pink-500 transition-all scale-90 active:scale-75"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <button
                    onClick={handleResetZoom}
                    className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-pink-100 shadow-sm hover:bg-white text-pink-500 transition-all scale-90 active:scale-75"
                    title="Reset View"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            <AnimatePresence>
                {(selectedProvinceId || hoveredDistrictName) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-pink-100 shadow-2xl pointer-events-none"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-pink-100 text-pink-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="font-bold text-gray-800 text-lg block leading-tight truncate">
                                        {thaiProvinces.find(p => p.id === selectedProvinceId)?.nameTh || "เลือกจังหวัด"}
                                    </span>
                                    {hoveredDistrictName && (
                                        <span className="text-xs text-pink-400 font-medium truncate block">อำเภอ{hoveredDistrictName}</span>
                                    )}
                                </div>
                            </div>
                            {selectedProvinceId && (
                                <div className="flex gap-2 shrink-0">
                                    {visitedThisYear.has(selectedProvinceId) && (
                                        <span className="p-1.5 rounded-full bg-pink-500 text-white"><Heart className="w-4 h-4 fill-white" /></span>
                                    )}
                                    {wishlist.has(selectedProvinceId) && (
                                        <span className="p-1.5 rounded-full bg-amber-400 text-white"><Star className="w-4 h-4 fill-white" /></span>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

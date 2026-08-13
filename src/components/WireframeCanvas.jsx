import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const getComponentPreview = (type) => {
    switch (type) {
        case 'header':
            return (
                <div className="w-full h-full flex items-center justify-between px-2">
                    <div className="w-8 h-2 bg-white/20 rounded" />
                    <div className="flex gap-1">
                        <div className="w-4 h-2 bg-white/20 rounded" />
                        <div className="w-4 h-2 bg-white/20 rounded" />
                    </div>
                </div>
            );
        case 'hero':
            return (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <div className="w-16 h-3 bg-white/20 rounded" />
                    <div className="w-8 h-2 bg-white/10 rounded" />
                    <div className="w-6 h-2 bg-highlight/40 rounded mt-1" />
                </div>
            );
        case 'grid':
            return (
                <div className="w-full h-full p-1 grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white/10 rounded-sm" />
                    ))}
                </div>
            );
        case 'list':
        case 'feed':
            return (
                <div className="w-full h-full p-2 flex flex-col gap-1">
                    <div className="w-full h-2 bg-white/10 rounded" />
                    <div className="w-full h-2 bg-white/10 rounded" />
                    <div className="w-3/4 h-2 bg-white/10 rounded" />
                </div>
            );
        case 'sidebar':
            return (
                <div className="w-full h-full flex gap-1 p-1">
                    <div className="w-1/4 h-full bg-white/10 rounded" />
                    <div className="flex-1 h-full bg-white/5 rounded" />
                </div>
            );
        case 'chart':
            return (
                <div className="w-full h-full flex items-end justify-center gap-1 p-2 pb-1">
                    <div className="w-2 h-4 bg-white/20 rounded-t" />
                    <div className="w-2 h-6 bg-white/20 rounded-t" />
                    <div className="w-2 h-3 bg-white/20 rounded-t" />
                    <div className="w-2 h-8 bg-highlight/40 rounded-t" />
                    <div className="w-2 h-5 bg-white/20 rounded-t" />
                </div>
            );
        case 'footer':
            return (
                <div className="w-full h-full flex flex-col justify-end p-2 gap-1">
                    <div className="w-full h-px bg-white/10" />
                    <div className="flex justify-between">
                        <div className="w-6 h-2 bg-white/10 rounded" />
                        <div className="w-12 h-2 bg-white/10 rounded" />
                    </div>
                </div>
            );
        default:
            return (
                <div className="w-3/4 h-2 bg-white/10 rounded" />
            );
    }
};

const SortableItem = ({ id, type, label }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative',
    };

    return (
        <div ref={setNodeRef} style={style} className={`group mb-4 ${isDragging ? 'opacity-50' : ''}`}>
            <div className="bg-[#1A1A1E] border border-white/10 rounded-lg p-4 flex items-center gap-4 hover:border-highlight/50 transition-colors">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white">
                    <GripVertical size={20} />
                </div>
                <div className="flex-1">
                    <div className="text-xs text-highlight font-mono mb-1 uppercase">{type}</div>
                    <div className="text-white font-medium">{label}</div>
                </div>
                {/* Visual Representation Mockup */}
                <div className="w-32 h-16 bg-black/30 rounded border border-white/5 flex items-center justify-center overflow-hidden">
                    {getComponentPreview(type)}
                </div>
            </div>
        </div>
    );
};

const WireframeCanvas = ({ components, setComponents }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setComponents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-6 min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Wireframe Canvas</h3>
                <div className="text-sm text-gray-400">Drag to reorder components</div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={components} strategy={verticalListSortingStrategy}>
                    {components.map((component) => (
                        <SortableItem key={component.id} id={component.id} type={component.type} label={component.label} />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default WireframeCanvas;

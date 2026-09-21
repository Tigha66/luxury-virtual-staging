import { RoomType, DesignStyle, StagingMode } from '@/types';

const basePrompt = `Virtually stage this real-estate listing photograph.

Preserve the original property's architecture and physical condition.

DO NOT change:
- room dimensions
- camera position
- lens perspective
- walls
- wall openings
- doors
- windows
- ceiling height
- flooring
- built-in cabinetry
- countertops
- plumbing fixtures
- fireplaces
- permanent lighting fixtures
- structural columns
- stairs
- exterior views through windows
- visible permanent property features

Do not invent windows, doors, rooms, views, pools, fireplaces, appliances, architectural details, renovations, or upgrades that are not present.

Add or replace only believable MOVABLE furnishings and décor appropriate for the selected room.

Furniture must have:
- realistic dimensions
- plausible placement
- realistic perspective
- realistic contact shadows
- realistic lighting
- realistic reflections
- safe walking paths

Do not block doors or major walkways.
Do not obscure important architectural features.

Produce photorealistic luxury real-estate photography.

No people.
No pets.
No text.
No logos.
No watermarks.
No surreal furniture.
No distorted furniture.
No duplicate objects.
No floating objects.

Preserve the photograph's overall framing and composition as closely as possible.`;

const roomSpecificInstructions: Record<RoomType, string> = {
  'living-room': 'Focus on a refined sofa arrangement with complementary accent chairs, side tables, and tasteful décor. Ensure clear focal points and balanced composition.',
  'primary-bedroom': 'Create an elegant bed setup with premium bedding, nightstands, and soft lighting. Maintain a serene, luxurious atmosphere.',
  'guest-bedroom': 'Stage a welcoming guest bedroom with quality furnishings and neutral, inviting décor.',
  'dining-room': 'Arrange an elegant dining table with appropriate seating, place settings, and ambient lighting.',
  'home-office': 'Create a professional yet sophisticated workspace with quality desk furniture and appropriate accessories.',
  'kitchen': 'Focus on kitchen stools, dining furniture, flowers, counter décor and movable accessories. Do not replace cabinetry, countertops or installed appliances.',
  'entry-foyer': 'Stage an impressive entry with console tables, mirrors, and welcoming décor.',
  'outdoor-patio': 'Arrange outdoor furniture, planters, and ambient lighting for an inviting exterior space.',
};

const styleInstructions: Record<DesignStyle, string> = {
  'modern-luxury': 'Use clean lines, neutral palettes with black/white/gray, minimalist accessories, and high-end modern furniture.',
  'warm-contemporary': 'Incorporate warm earth tones, natural materials, soft textures, and contemporary furnishings.',
  'organic-modern': 'Blend natural materials, wood elements, plants, and organic shapes with modern design principles.',
  'transitional': 'Balance traditional elegance with contemporary simplicity using classic furniture with modern finishes.',
  'scandinavian': 'Use light woods, white/gray palettes, functional furniture, and minimalist Nordic aesthetics.',
  'mid-century-modern': 'Feature iconic mid-century furniture pieces, geometric patterns, and retro-inspired color palettes.',
  'coastal-luxury': 'Incorporate light colors, natural textures, nautical elements, and breezy, relaxed luxury aesthetics.',
  'minimalist-luxury': 'Use minimal furniture, maximized negative space, premium materials, and a refined monochromatic palette.',
};

export function buildStagingPrompt(
  roomType: RoomType,
  designStyle: DesignStyle,
  stagingMode: StagingMode,
  customInstruction?: string
): string {
  let prompt = basePrompt;

  if (stagingMode === 'restyle') {
    prompt += '\n\nReplace or visually restyle movable furniture while preserving permanent architecture.';
  } else {
    prompt += '\n\nStage the room as if it were empty or minimally furnished, then add high-quality furnishings.';
  }

  prompt += `\n\n${roomSpecificInstructions[roomType]}`;
  prompt += `\n\nDesign style: ${styleInstructions[designStyle]}`;

  if (customInstruction) {
    prompt += `\n\nAdditional guidance: ${customInstruction}`;
  }

  prompt +=
    '\n\nPrioritize photorealism, tasteful furnishings, believable scale, premium materials, natural shadows, visual restraint, and neutral listing-friendly styling.';

  return prompt;
}

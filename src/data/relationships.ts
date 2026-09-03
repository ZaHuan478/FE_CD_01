import { getRuntimeDataset } from '../database/runtimeData'

export type RelationshipType = 'used-by' | 'contains' | 'supports' | 'feeds' | 'related-to'
export type Relationship = { source: string; target: string; type: RelationshipType }

export const relationships = getRuntimeDataset<{ relationships: Relationship[] }>('legacy.data').relationships

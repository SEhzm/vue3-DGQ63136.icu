import { get } from '@/apis/httpInstance';
import { API } from '@/constants/backend';
import type { DnaV6Response } from '@/types/memeDnaV6';

export function getMemeDnaGraphV6(memeId: number | string) {
    return get<DnaV6Response>(`${API.DNA_RELATIONS_V6}/${memeId}`);
}

export function getMemeDnaEvolutionV6(memeId: number | string) {
    return get<DnaV6Response>(`${API.DNA_RELATIONS_V6}/${memeId}/evolution`);
}

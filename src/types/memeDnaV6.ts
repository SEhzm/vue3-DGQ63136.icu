/**
 * 梗 DNA v6 关联图接口类型（/dgq/dna/v6/{barrageId}, /dgq/dna/v6/{barrageId}/evolution）
 */

export interface DnaV6Relation {
    barrageId: number;
    barrage: string;
    relationType: string;
    score?: number;
    template?: string;
}

export interface DnaV6EvolutionStep {
    step: number;
    barrage: string;
    fromBarrageId?: number;
    toBarrageId?: number;
    date?: string;
    note?: string;
}

export interface DnaV6Response {
    code: number;
    msg: string;
    data: {
        barrageId: number;
        barrage: string;
        template?: string;
        relations: DnaV6Relation[];
        evolution?: DnaV6EvolutionStep[];
    };
}

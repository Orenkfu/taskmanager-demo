export interface PersistenceHealth {
  ping(): Promise<void>;
}

export const PERSISTENCE_HEALTH = Symbol('PERSISTENCE_HEALTH');

// ******************** //
// Interfaces for the createPost event file.
// ******************** //

import { EventArguments, FronvoError } from 'interfaces/all';

export interface CreatePostParams {
    title: string;
    content: string;
}

export interface CreatePostServerParams
    extends EventArguments,
        CreatePostParams {}

export interface CreatePostResult {
    title: string;
    content: string;
    creationDate: Date;
}

export interface CreatePostTestResult extends FronvoError, CreatePostResult {}
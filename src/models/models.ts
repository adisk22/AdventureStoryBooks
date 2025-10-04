export interface UnprocessedStory 
{
  page_number: number,
  text_content: string
}

export interface storyPagesToStory {
    biome: string | null
    id: number
    imageUrl: string | null
    nextPrompt: string | null
    pageNum: number | null
    storyID: number | null
    text: string | null
}

export interface ContainsProfanity {
    profanity: boolean;
}
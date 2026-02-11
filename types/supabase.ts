export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      en_dictionaries: {
        Row: {
          created_at: string | null;
          id: string;
          user_id: string | null;
          words_stat: Json | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
          words_stat?: Json | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
          words_stat?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_dictionaries_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      en_dictionary_words: {
        Row: {
          dictionary_id: string | null;
          last_time_trained_at: string | null;
          status: Database['public']['Enums']['word_status'];
          usagecount: number | null;
          word_id: string | null;
        };
        Insert: {
          dictionary_id?: string | null;
          last_time_trained_at?: string | null;
          status?: Database['public']['Enums']['word_status'];
          usagecount?: number | null;
          word_id?: string | null;
        };
        Update: {
          dictionary_id?: string | null;
          last_time_trained_at?: string | null;
          status?: Database['public']['Enums']['word_status'];
          usagecount?: number | null;
          word_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_dictionary_words_dictionary_id_fkey';
            columns: ['dictionary_id'];
            isOneToOne: false;
            referencedRelation: 'en_dictionaries';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'en_dictionary_words_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'en_words';
            referencedColumns: ['id'];
          },
        ];
      };
      en_from_uk_training_choose_translation: {
        Row: {
          en_translations_options: string | null;
          word_id: string | null;
        };
        Insert: {
          en_translations_options?: string | null;
          word_id?: string | null;
        };
        Update: {
          en_translations_options?: string | null;
          word_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_from_ua_training_choose_translation_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'en_words';
            referencedColumns: ['id'];
          },
        ];
      };
      en_review_senteceses: {
        Row: {
          index: number | null;
          review_id: string;
          text: string | null;
        };
        Insert: {
          index?: number | null;
          review_id: string;
          text?: string | null;
        };
        Update: {
          index?: number | null;
          review_id?: string;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_review_senteceses_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'en_reviews';
            referencedColumns: ['id'];
          },
        ];
      };
      en_reviews: {
        Row: {
          document_link: string | null;
          id: string;
          sentence_cursor: number | null;
          sentences_count: number | null;
          title: string | null;
          total_words_count: number | null;
          unique_words_count: number | null;
          user_id: string | null;
          words_stat: Json | null;
        };
        Insert: {
          document_link?: string | null;
          id?: string;
          sentence_cursor?: number | null;
          sentences_count?: number | null;
          title?: string | null;
          total_words_count?: number | null;
          unique_words_count?: number | null;
          user_id?: string | null;
          words_stat?: Json | null;
        };
        Update: {
          document_link?: string | null;
          id?: string;
          sentence_cursor?: number | null;
          sentences_count?: number | null;
          title?: string | null;
          total_words_count?: number | null;
          unique_words_count?: number | null;
          user_id?: string | null;
          words_stat?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_analyses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      en_reviews_words: {
        Row: {
          review_id: string;
          usage_count: number | null;
          word_id: string | null;
        };
        Insert: {
          review_id: string;
          usage_count?: number | null;
          word_id?: string | null;
        };
        Update: {
          review_id?: string;
          usage_count?: number | null;
          word_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_reviews_words_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'en_reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'en_reviews_words_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'en_words';
            referencedColumns: ['id'];
          },
        ];
      };
      en_to_ua_training_choose_translation: {
        Row: {
          ua_translations_options: string | null;
          word_id: string | null;
        };
        Insert: {
          ua_translations_options?: string | null;
          word_id?: string | null;
        };
        Update: {
          ua_translations_options?: string | null;
          word_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_to_ua_training_choose_translation_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'en_words';
            referencedColumns: ['id'];
          },
        ];
      };
      en_to_uk_word_details: {
        Row: {
          definition: string | null;
          translations_text: string | null;
          word_id: string;
        };
        Insert: {
          definition?: string | null;
          translations_text?: string | null;
          word_id: string;
        };
        Update: {
          definition?: string | null;
          translations_text?: string | null;
          word_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'en_to_ua_word_details_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: true;
            referencedRelation: 'en_words';
            referencedColumns: ['id'];
          },
        ];
      };
      en_training_shoose_antonyms: {
        Row: {
          options: string | null;
          word_id: string | null;
        };
        Insert: {
          options?: string | null;
          word_id?: string | null;
        };
        Update: {
          options?: string | null;
          word_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_training_shoose_antonyms_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'en_words';
            referencedColumns: ['id'];
          },
        ];
      };
      en_training_shoose_synonym: {
        Row: {
          options: string | null;
          word_id: string | null;
        };
        Insert: {
          options?: string | null;
          word_id?: string | null;
        };
        Update: {
          options?: string | null;
          word_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_training_shoose_synonym_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'en_words';
            referencedColumns: ['id'];
          },
        ];
      };
      en_words: {
        Row: {
          antonyms: string | null;
          definition: string | null;
          id: string;
          phonetic_audio_link: string | null;
          phonetic_text: string | null;
          synonymous: string | null;
          text: string | null;
        };
        Insert: {
          antonyms?: string | null;
          definition?: string | null;
          id?: string;
          phonetic_audio_link?: string | null;
          phonetic_text?: string | null;
          synonymous?: string | null;
          text?: string | null;
        };
        Update: {
          antonyms?: string | null;
          definition?: string | null;
          id?: string;
          phonetic_audio_link?: string | null;
          phonetic_text?: string | null;
          synonymous?: string | null;
          text?: string | null;
        };
        Relationships: [];
      };
      learning_languages: {
        Row: {
          code: string;
          name: string;
        };
        Insert: {
          code: string;
          name: string;
        };
        Update: {
          code?: string;
          name?: string;
        };
        Relationships: [];
      };
      native_languages: {
        Row: {
          code: string;
          name: string;
        };
        Insert: {
          code: string;
          name: string;
        };
        Update: {
          code?: string;
          name?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string | null;
          id: string;
          learning_language: string | null;
          native_language: string | null;
          role: string | null;
          username: string | null;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          learning_language?: string | null;
          native_language?: string | null;
          role?: string | null;
          username?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          learning_language?: string | null;
          native_language?: string | null;
          role?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      wrappers_fdw_stats: {
        Row: {
          bytes_in: number | null;
          bytes_out: number | null;
          create_times: number | null;
          created_at: string;
          fdw_name: string;
          metadata: Json | null;
          rows_in: number | null;
          rows_out: number | null;
          updated_at: string;
        };
        Insert: {
          bytes_in?: number | null;
          bytes_out?: number | null;
          create_times?: number | null;
          created_at?: string;
          fdw_name: string;
          metadata?: Json | null;
          rows_in?: number | null;
          rows_out?: number | null;
          updated_at?: string;
        };
        Update: {
          bytes_in?: number | null;
          bytes_out?: number | null;
          create_times?: number | null;
          created_at?: string;
          fdw_name?: string;
          metadata?: Json | null;
          rows_in?: number | null;
          rows_out?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      en_review_words: {
        Row: {
          review_id: string | null;
          usage_count: number | null;
          word_id: string | null;
        };
        Insert: {
          review_id?: string | null;
          usage_count?: number | null;
          word_id?: string | null;
        };
        Update: {
          review_id?: string | null;
          usage_count?: number | null;
          word_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'en_reviews_words_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'en_reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'en_reviews_words_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'en_words';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      add_review_data: {
        Args: {
          document_link?: string;
          lang_code: string;
          sentences: Json;
          title: string;
          word_entries: Json;
        };
        Returns: undefined;
      };
      add_word: {
        Args: { lang_code: string; word_text: string };
        Returns: undefined;
      };
      add_word_to_user_dictionary: {
        Args: { lang_code: string; user_id: string; word_text: string };
        Returns: undefined;
      };
      airtable_fdw_handler: { Args: never; Returns: unknown };
      airtable_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      airtable_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      auth0_fdw_handler: { Args: never; Returns: unknown };
      auth0_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      auth0_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      big_query_fdw_handler: { Args: never; Returns: unknown };
      big_query_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      big_query_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      click_house_fdw_handler: { Args: never; Returns: unknown };
      click_house_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      click_house_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      cognito_fdw_handler: { Args: never; Returns: unknown };
      cognito_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      cognito_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      delete_review: { Args: { p_review_id: string }; Returns: undefined };
      duckdb_fdw_handler: { Args: never; Returns: unknown };
      duckdb_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      duckdb_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      firebase_fdw_handler: { Args: never; Returns: unknown };
      firebase_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      firebase_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      get_analysis_by_id: {
        Args: { p_analysis_id: string; p_user_id: string };
        Returns: Json;
      };
      get_analysis_sentences: {
        Args: {
          p_analysis_id: string;
          p_limit?: number;
          p_offset?: number;
          p_user_id: string;
        };
        Returns: Json[];
      };
      get_dict_stat: { Args: { p_lang_code: string }; Returns: Json };
      get_dictionary_words: {
        Args: {
          lang_code: string;
          limit_count?: number;
          offset_count?: number;
          review_ids?: string[];
          search_text?: string;
          sort_by_usage_count?: string;
          sort_order?: string;
          status_filter?: Database['public']['Enums']['word_status'][];
          translation_lang: string;
        };
        Returns: {
          antonyms: string;
          definition: string;
          in_reviews: boolean;
          phonetic_audio_link: string;
          phonetic_text: string;
          status: Database['public']['Enums']['word_status'];
          synonymous: string;
          text: string;
          total_count: number;
          translation: string;
          translation_definition: string;
          usagecount: number;
          word_id: string;
        }[];
      };
      get_random_word: {
        Args: { p_lang_code?: string; p_translation_lang?: string };
        Returns: {
          antonyms: string;
          definition: string;
          phonetic_audio_link: string;
          phonetic_text: string;
          status: string;
          synonymous: string;
          text: string;
          translation: string;
          translation_definition: string;
          usagecount: number;
          word_id: string;
        }[];
      };
      get_reviews: {
        Args: { p_limit?: number; p_offset?: number };
        Returns: {
          document_link: string;
          id: string;
          sentence_cursor: number;
          sentences_count: number;
          title: string;
          total_words_count: number;
          unique_words_count: number;
          words_stat: Json;
        }[];
      };
      get_reviews_for_filter: {
        Args: { lang_code: string };
        Returns: {
          id: string;
          title: string;
        }[];
      };
      get_user: {
        Args: never;
        Returns: {
          created_at: string;
          id: string;
          learning_language: string;
          native_language: string;
        }[];
      };
      get_user_analyses_for_filter: {
        Args: { lang_code: string };
        Returns: {
          id: string;
          title: string;
        }[];
      };
      hello_world_fdw_handler: { Args: never; Returns: unknown };
      hello_world_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      hello_world_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      iceberg_fdw_handler: { Args: never; Returns: unknown };
      iceberg_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      iceberg_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      logflare_fdw_handler: { Args: never; Returns: unknown };
      logflare_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      logflare_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      mssql_fdw_handler: { Args: never; Returns: unknown };
      mssql_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      mssql_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      redis_fdw_handler: { Args: never; Returns: unknown };
      redis_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      redis_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      remove_word_from_dictionary: {
        Args: { lang_code: string; p_word_id: string };
        Returns: undefined;
      };
      s3_fdw_handler: { Args: never; Returns: unknown };
      s3_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      s3_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      save_review_data: {
        Args: {
          document_link?: string;
          lang_code: string;
          sentences: Json;
          title: string;
          word_entries: Json;
        };
        Returns: undefined;
      };
      set_user_languages: {
        Args: { learning: string; native: string };
        Returns: undefined;
      };
      stripe_fdw_handler: { Args: never; Returns: unknown };
      stripe_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      stripe_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      update_translation_word_details: {
        Args: {
          lang_code: string;
          p_definition: string;
          p_translations_text: string;
          p_word_id: string;
          target_lang_code: string;
        };
        Returns: Json;
      };
      update_word_definition: {
        Args: {
          lang_code: string;
          new_definition?: string;
          new_phonetic_audio_link?: string;
          new_phonetic_text?: string;
          word_id: string;
        };
        Returns: Json;
      };
      update_word_status: {
        Args: { lang_code: string; p_new_status: string; p_word_id: string };
        Returns: undefined;
      };
      update_words_stat_data: { Args: { lang_code: string }; Returns: boolean };
      wasm_fdw_handler: { Args: never; Returns: unknown };
      wasm_fdw_meta: {
        Args: never;
        Returns: {
          author: string;
          name: string;
          version: string;
          website: string;
        }[];
      };
      wasm_fdw_validator: {
        Args: { catalog: unknown; options: string[] };
        Returns: undefined;
      };
      words_stat: { Args: { p_lang_code: string }; Returns: Json };
    };
    Enums: {
      word_status: '1' | '2' | '3' | '4' | '5' | '6' | '7';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      word_status: ['1', '2', '3', '4', '5', '6', '7'],
    },
  },
} as const;

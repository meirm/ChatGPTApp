

export const systemPrompts = [
    {label: "agility_story", value: 1, search:"agility_story"},
    {label: "ai", value: 2, search:"ai"},
    {label: "analyze_claims", value: 3, search:"analyze_claims"},
    {label: "analyze_incident", value: 4, search:"analyze_incident"},
    {label: "analyze_paper", value: 5, search:"analyze_paper"},
    {label: "analyze_prose", value: 6, search:"analyze_prose"},
    {label: "analyze_prose_json", value: 7, search:"analyze_prose_json"},
    {label: "analyze_spiritual_text", value: 8, search:"analyze_spiritual_text"},
    {label: "analyze_tech_impact", value: 9, search:"analyze_tech_impact"},
    {label: "analyze_threat_report", value: 10, search:"analyze_threat_report"},
    {label: "analyze_threat_report_trends", value: 11, search:"analyze_threat_report_trends"},
    {label: "check_agreement", value: 12, search:"check_agreement"},
    {label: "clean_text", value: 13, search:"clean_text"},
    {label: "compare_and_contrast", value: 14, search:"compare_and_contrast"},
    {label: "create_aphorisms", value: 15, search:"create_aphorisms"},
    {label: "create_command", value: 16, search:"create_command"},
    {label: "create_keynote", value: 17, search:"create_keynote"},
    {label: "create_logo", value: 18, search:"create_logo"},
    {label: "create_markmap_visualization", value: 19, search:"create_markmap_visualization"},
    {label: "create_mermaid_visualization", value: 20, search:"create_mermaid_visualization"},
    {label: "create_npc", value: 21, search:"create_npc"},
    {label: "create_threat_model", value: 22, search:"create_threat_model"},
    {label: "create_video_chapters", value: 23, search:"create_video_chapters"},
    {label: "create_visualization", value: 24, search:"create_visualization"},
    {label: "explain_code", value: 25, search:"explain_code"},
    {label: "explain_docs", value: 26, search:"explain_docs"},
    {label: "extract_algorithm_update_recommendations", value: 27, search:"extract_algorithm_update_recommendations"},
    {label: "extract_article_wisdom", value: 28, search:"extract_article_wisdom"},
    {label: "extract_ideas", value: 29, search:"extract_ideas"},
    {label: "extract_patterns", value: 30, search:"extract_patterns"},
    {label: "extract_poc", value: 31, search:"extract_poc"},
    {label: "extract_predictions", value: 32, search:"extract_predictions"},
    {label: "extract_recommendations", value: 33, search:"extract_recommendations"},
    {label: "extract_references", value: 34, search:"extract_references"},
    {label: "extract_sponsors", value: 35, search:"extract_sponsors"},
    {label: "extract_videoid", value: 36, search:"extract_videoid"},
    {label: "extract_wisdom", value: 37, search:"extract_wisdom"},
    {label: "find_hidden_message", value: 38, search:"find_hidden_message"},
    {label: "improve_prompt", value: 39, search:"improve_prompt"},
    {label: "improve_writing", value: 40, search:"improve_writing"},
    {label: "label_and_rate", value: 41, search:"label_and_rate"},
    {label: "philocapsulate", value: 42, search:"philocapsulate"},
    {label: "provide_guidance", value: 43, search:"provide_guidance"},
    {label: "rate_content", value: 44, search:"rate_content"},
    {label: "rate_value", value: 45, search:"rate_value"},
    {label: "summarize", value: 46, search:"summarize"},
    {label: "summarize_git_changes", value: 47, search:"summarize_git_changes"},
    {label: "summarize_micro", value: 48, search:"summarize_micro"},
    {label: "summarize_newsletter", value: 49, search:"summarize_newsletter"},
    {label: "summarize_pull-requests", value: 50, search:"summarize_pull-requests"},
    {label: "summarize_rpg_session", value: 51, search:"summarize_rpg_session"},
    {label: "write_essay", value: 52, search:"write_essay"},
    {label: "write_semgrep_rule", value: 53, search:"write_semgrep_rule"}
    ];

// We will fetch the system prompts from the repo https://github.com/meirm/UniversalPrompts under repository/{label}/system.md

export const fetchSystemPrompt = async (label:string) => {
    const response = await fetch(`https://raw.githubusercontent.com/meirm/UniversalPrompts/main/repository/${label}/system.md`);
    const data = await response.text();
    return data;
    }
/**
 * サイト共通レイアウト（BaseLayout）で読み込む Material Symbols のアイコン名。
 * ここに挙げたアイコンだけを含む部分フォント（全アイコンは約1.4MB、この一覧で約80KB）を
 * `npm run fetch-fonts` で Google Fonts から取得し、public/fonts/ から自サイトで配信する。
 * 新しいアイコンを使うときは、この一覧に名前を追加してから `npm run fetch-fonts` を実行する。
 * 一覧への追加し忘れと、追加後の取り直し忘れは、ビルド後の scripts/check-icons.mjs が止めて知らせる。
 * Google Fonts の指定上、アルファベット順に並べる（取得時に並べ替えている）。
 */
export const materialIconNames = [
  'accessible_forward', 'account_tree', 'add', 'add_circle', 'ads_click', 'analytics', 'architecture',
  'arrow_back', 'arrow_downward', 'arrow_forward', 'article', 'assistant', 'auto_awesome', 'automation',
  'badge', 'bar_chart', 'battery_full', 'battery_horiz_075', 'bed', 'bedtime', 'block', 'bolt',
  'box', 'bubble', 'build', 'business', 'business_center', 'calendar_add_on', 'calendar_month',
  'calendar_today', 'campaign', 'cancel', 'cases', 'category', 'chair', 'check', 'check_circle',
  'checklist', 'chevron_right', 'clear', 'close', 'cloud', 'compare_arrows', 'computer', 'conditions',
  'construction', 'contact_mail', 'contrast', 'copyright', 'create_new_folder', 'crop_free', 'cycle',
  'dashboard', 'description', 'details', 'diamond', 'directions_run', 'do_not_disturb_on', 'domain',
  'done', 'done_all', 'door_front', 'download', 'drive_folder_upload', 'east', 'eco', 'edit_note',
  'email', 'error', 'error_outline', 'event', 'event_available', 'event_note', 'eyebrow', 'fact_check',
  'folder', 'format_list_numbered', 'forum', 'function', 'grid_view', 'group', 'groups', 'handshake',
  'handyman', 'height', 'help', 'history', 'home', 'hourglass_empty', 'hub', 'image', 'info', 'input',
  'inventory_2', 'keyboard_arrow_down', 'label', 'language', 'layers', 'leaderboard', 'link', 'list',
  'local_hospital', 'location_on', 'lock', 'lock_open', 'looks_3', 'looks_one', 'looks_two', 'mail',
  'manage_accounts', 'manage_search', 'menu', 'menu_book', 'message', 'mobile', 'mobile_menu',
  'monitor_weight', 'monitoring', 'more_horiz', 'mouse', 'navigation', 'news', 'north_east', 'note',
  'notifications', 'notifications_active', 'notifications_none', 'open_in_new', 'outgoing_mail',
  'pages', 'palette', 'pattern', 'pause', 'payments', 'pending', 'pending_actions', 'people', 'person',
  'person_add', 'person_pin', 'pets', 'phone', 'play_arrow', 'policy', 'precision_manufacturing',
  'preview', 'priority_high', 'privacy', 'psychiatry', 'psychology', 'psychology_alt', 'public',
  'radio', 'radio_button_unchecked', 'receipt_long', 'redeem', 'refresh', 'remove', 'replay', 'resize',
  'restart_alt', 'rocket_launch', 'save', 'scale', 'schedule', 'school', 'score', 'script', 'search',
  'search_insights', 'select', 'self_improvement', 'send', 'sentiment_dissatisfied', 'sentiment_neutral',
  'sentiment_satisfied', 'sentiment_stressed', 'settings', 'shield', 'shield_lock', 'shopping_cart',
  'signal_cellular_alt', 'signpost', 'smart_toy', 'smartphone', 'source', 'south', 'space_dashboard',
  'speed', 'star', 'start', 'step', 'stylus', 'support', 'support_agent', 'swap_horiz', 'sync',
  'sync_alt', 'tab', 'table_chart', 'target', 'task_alt', 'timeline', 'tips_and_updates', 'title',
  'tooltip', 'topic', 'touch_app', 'trending_down', 'trending_up', 'troubleshoot', 'tune', 'update',
  'upgrade', 'upload_file', 'verified', 'verified_user', 'video_chat', 'visibility', 'warning',
  'wc', 'web', 'web_traffic', 'width', 'wifi', 'work',
] as const;

// 取得時の指定は scripts/fetch-fonts.mjs（display=block。swapだと読込前に「arrow_forward」等の文字が一瞬見えるため）
export const materialIconsHref = '/fonts/material-symbols-rounded.css';

import { useMemo, useState } from 'react';

type Field = 'name' | 'price' | 'category' | 'description';
type MenuItem = { id: string; name: string; price: string; category: string; description: string; low: Partial<Record<Field, boolean>> };
type SampleKey = 'cafe' | 'chalkboard' | 'deli';
type Sample = { key: SampleKey; label: string; shop: string; text: string; kind: 'paper' | 'chalk' | 'raw'; items: MenuItem[] };

const samples: Sample[] = [
  {
    key: 'cafe', label: 'Clean café menu', shop: 'Maple Street Café', kind: 'paper',
    text: 'MAPLE STREET CAFÉ\nCoffee\nHouse Drip 3.25\nMaple Latte 5.25\nCappuccino 4.75\nCold Brew 4.50\n\nPastries\nButter Croissant 4.25\nBlueberry Scone 4.00\n\nBreakfast\nAvocado Toast 9.50\nMaple Oat Pancakes 11.00',
    items: [
      ['House Drip', '3.25', 'Coffee', 'Freshly brewed coffee, poured cup by cup.'],
      ['Maple Latte', '5.25', 'Coffee', 'Espresso and steamed milk with a touch of maple.'],
      ['Cappuccino', '4.75', 'Coffee', 'A balanced espresso with velvety steamed milk.'],
      ['Cold Brew', '4.50', 'Coffee', 'Slow-steeped coffee served chilled.'],
      ['Butter Croissant', '4.25', 'Pastries', 'A flaky, golden pastry baked fresh each morning.'],
      ['Blueberry Scone', '4.00', 'Pastries', 'A tender house-made scone with blueberries.'],
      ['Avocado Toast', '9.50', 'Breakfast', 'Smashed avocado on thick-cut toasted sourdough.'],
      ['Maple Oat Pancakes', '11.00', 'Breakfast', 'A stack of soft pancakes finished with maple.'],
    ].map(([name, price, category, description], i) => item(`c${i}`, name, price, category, description)),
  },
  {
    key: 'chalkboard', label: 'Handwritten chalkboard', shop: 'Corner Scoop Ice Cream', kind: 'chalk',
    text: 'CORNER SCOOP\nToday’s scoops\nVanilla Bean — $4.50\nChocolate Fudge — $4.75\nStrawberry Swirl — $4.75\nSalted Caramel — $5.00\nMint Chip — $4.75\nWaffle Cone — $1.25',
    items: [
      ['Vanilla Bean', '4.50', 'Scoops', 'Classic vanilla with a rich, creamy finish.', {}],
      ['Chocolate Fudge', '4.75', 'Scoops', 'Deep chocolate with ribbons of fudge.', { price: true }],
      ['Strawberry Swirl', '4.75', 'Scoops', 'Strawberry folded through a smooth cream base.', {}],
      ['Salted Caramel', '5.00', 'Scoops', 'Caramel with a little salty-sweet balance.', { price: true }],
      ['Mint Chip', '4.75', 'Scoops', 'Cool mint with small chocolate pieces.', { name: true }],
      ['Waffle Cone', '1.25', 'Extras', 'A crisp, freshly made cone for your scoop.', {}],
    ].map(([name, price, category, description, low], i) => {
      const conf = (low || {}) as Partial<Record<Field, boolean>>;
      return item(`h${i}`, String(name), String(price), String(category), String(description), conf);
    }),
  },
  {
    key: 'deli', label: 'Messy pasted text', shop: "Nonna's Deli", kind: 'raw',
    text: "nonna's deli\nmeatball hero 8.5\nchicken parm sandwich $8.50\nitalian sub 8 dollars\nsoup of the day 6.5\ncaprese panini 9\nlasagna special price?\nall made fresh",
    items: [
      ['Meatball Hero', '8.50', 'Sandwiches', 'Slow-simmered meatballs with tomato sauce on a toasted roll.', {}],
      ['Chicken Parm Sandwich', '8.50', 'Sandwiches', 'Breaded chicken with tomato sauce and melted cheese.', {}],
      ['Italian Sub', '8.00', 'Sandwiches', 'A generous deli sandwich layered with Italian favorites.', {}],
      ['Soup of the Day', '6.50', 'Sides', 'A comforting soup prepared fresh in the deli kitchen.', {}],
      ['Caprese Panini', '9.00', 'Sandwiches', 'Tomato, mozzarella, and basil pressed on warm bread.', {}],
      ['Lasagna Special', '', 'Hot counter', 'A daily baked pasta special from Nonna’s kitchen.', { price: true }],
    ].map(([name, price, category, description, low], i) => item(`d${i}`, String(name), String(price), String(category), String(description), (low || {}) as Partial<Record<Field, boolean>>)),
  },
];

function item(id: string, name: string, price: string, category: string, description: string, low: Partial<Record<Field, boolean>> = {}): MenuItem {
  return { id, name, price, category, description, low };
}

const noItemsMessage = "We couldn't find any items with prices. Try a clearer photo, paste your menu, or use a sample.";

function Brand() {
  return <header className="topbar"><div className="brand"><span className="brand-mark" aria-hidden="true">t</span><span>Things <span style={{ fontWeight: 400, color: '#718076' }}>for shops</span></span></div><div className="top-note">A simpler way to bring your menu online</div></header>;
}

function PrototypeBanner() {
  return <div className="prototype-banner"><span className="banner-dot" />Prototype: AI menu reading is simulated with prepared sample results.</div>;
}

function MenuSource({ sample }: { sample: Sample }) {
  if (sample.kind === 'raw') return <div className="raw-menu">{sample.text}</div>;
  const rows = sample.items;
  return <div className={sample.kind === 'chalk' ? 'chalk-menu' : 'paper-menu'}>
    <h4>{sample.shop}</h4>
    {rows.map((entry) => <div className="chalk-line" key={entry.id}><span>{entry.name}</span><span>{entry.price ? `$${entry.price}` : 'market price'}</span></div>)}
    {sample.kind === 'paper' && <div style={{ textAlign: 'center', fontSize: 10, marginTop: 10, color: '#828c78' }}>A little something made fresh, every day</div>}
  </div>;
}

function App() {
  const [screen, setScreen] = useState<'upload' | 'review' | 'store'>('upload');
  const [activeSample, setActiveSample] = useState<SampleKey | null>(null);
  const [menuText, setMenuText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileIsImage, setFileIsImage] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [shopName, setShopName] = useState('');
  const [draftSample, setDraftSample] = useState<Sample | null>(null);

  const selectedSample = useMemo(() => samples.find((sample) => sample.key === activeSample) ?? null, [activeSample]);
  const unresolved = items.reduce((count, entry) => count + Object.values(entry.low).filter(Boolean).length, 0);

  const chooseSample = (sample: Sample) => {
    setActiveSample(sample.key);
    setMenuText(sample.text);
    setFileName('');
    setFileIsImage(false);
    setNotice('');
    setError('');
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setFileIsImage(file.type.startsWith('image/'));
    setActiveSample(null);
    setNotice(file.type.startsWith('image/') ? 'Photo reading is simulated in this prototype. Choose one of the prepared samples below to see a draft.' : 'This demo only provides prepared sample results. Choose one of the samples below to continue.');
    setError('');
  };

  const extract = () => {
    setNotice('');
    setError('');
    if (fileName && fileIsImage) {
      setNotice('Photo reading is simulated in this prototype. Choose one of the prepared samples below to see a draft.');
      return;
    }
    if (selectedSample) {
      setReading(true);
      window.setTimeout(() => {
        setDraftSample(selectedSample);
        setShopName(selectedSample.shop);
        setItems(selectedSample.items.map((entry) => ({ ...entry, low: { ...entry.low } })));
        setScreen('review');
        setReading(false);
      }, 1500);
      return;
    }
    if (!menuText.trim()) {
      setError(noItemsMessage);
      return;
    }
    if (/\$?\s*\d+(?:\.\d{1,2})?/.test(menuText)) {
      setNotice('This demo only provides prepared sample results, so it won’t create a draft from pasted text. Choose one of the samples below.');
      return;
    }
    setError(noItemsMessage);
  };

  const updateField = (id: string, field: Field, value: string) => {
    setItems((current) => current.map((entry) => entry.id === id ? { ...entry, [field]: value, low: { ...entry.low, [field]: false } } : entry));
  };
  const confirmField = (id: string, field: Field, confirmed: boolean) => {
    if (confirmed) setItems((current) => current.map((entry) => entry.id === id ? { ...entry, low: { ...entry.low, [field]: false } } : entry));
  };
  const addItem = () => setItems((current) => [...current, item(`new-${Date.now()}`, '', '', '', '')]);
  const deleteItem = (id: string) => setItems((current) => current.filter((entry) => entry.id !== id));
  const reset = () => {
    setScreen('upload'); setActiveSample(null); setMenuText(''); setFileName(''); setFileIsImage(false);
    setNotice(''); setError(''); setItems([]); setDraftSample(null); setShopName('');
  };

  const renderField = (entry: MenuItem, field: Field) => {
    const value = entry[field];
    const low = Boolean(entry.low[field]);
    const label = `${field[0].toUpperCase()}${field.slice(1)} for ${entry.name || 'new item'}`;
    return <div className={`field-wrap ${low ? 'low' : ''}`}>
      {field === 'description' && <span className="ai-label">AI draft</span>}
      {field === 'category'
        ? <input aria-label={label} value={value} onChange={(event) => updateField(entry.id, field, event.target.value)} placeholder="Category" />
        : field === 'description'
          ? <textarea aria-label={label} value={value} onChange={(event) => updateField(entry.id, field, event.target.value)} placeholder="Add a short description" />
          : <input aria-label={label} value={value} onChange={(event) => updateField(entry.id, field, event.target.value)} placeholder={field === 'price' ? '$0.00' : 'Item name'} />}
      {low && <label className="field-status">
        <input type="checkbox" aria-label={`Confirm ${field} for ${entry.name || 'new item'}`} onChange={(event) => confirmField(entry.id, field, event.target.checked)} />
        Please check
      </label>}
    </div>;
  };

  return <div className="app-shell">
    <Brand />
    <PrototypeBanner />
    {screen === 'upload' && <main className="page">
      <div className="intro">
        <div className="eyebrow">Merchant setup · Step 1 of 3</div>
        <h1>Get your shop on Things in minutes</h1>
        <p className="lede">Start with the menu you already have. We’ll help you turn it into a clear storefront your neighbors can browse.</p>
      </div>
      <div className="workspace">
        <section className="panel upload-panel" aria-label="Add your menu">
          <div className="panel-heading"><div><h3>Bring your menu</h3><p>Use a photo, paste the text, or try a prepared example.</p></div></div>
          <label className="upload-target" htmlFor="menu-file">
            <span className="upload-glyph" aria-hidden="true">↑</span>
            <strong>{fileName || 'Upload a photo of your menu'}</strong>
            <small>{fileName ? 'Choose a different file' : 'JPG, PNG or HEIC · Use a clear, well-lit photo'}</small>
          </label>
          <input id="menu-file" className="file-input" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
          <div className="or-divider">or</div>
          {selectedSample && selectedSample.kind !== 'raw'
            ? <div className="textarea-label">…or paste your menu text</div>
            : <label className="textarea-label" htmlFor="menu-text">…or paste your menu text</label>}
          {selectedSample && selectedSample.kind !== 'raw'
            ? <div className="source-preview input-menu-preview" aria-label={`${selectedSample.label} sample menu preview`}><MenuSource sample={selectedSample} /></div>
            : <textarea id="menu-text" value={menuText} onChange={(event) => { setMenuText(event.target.value); if (activeSample && event.target.value !== selectedSample?.text) { setActiveSample(null); } setError(''); setNotice(''); }} placeholder={'Coffee 3.25\nCroissant 4.00\nAvocado toast 9.50'} />}
          <div className="sample-label">Not ready to upload? Take a look at a sample</div>
          <div className="sample-grid">
            {samples.map((sample) => <button key={sample.key} className={`sample-button ${activeSample === sample.key ? 'selected' : ''}`} onClick={() => chooseSample(sample)}>{`Try sample: ${sample.label}`}</button>)}
          </div>
          {error && <div className="notice error" role="alert">{error}</div>}
          {notice && <div className="notice" role="status">{notice}</div>}
          <div className="form-footer">
            <span className="helper">You can review and change every detail before publishing.</span>
            <button className="primary-button" onClick={extract} disabled={reading}>{reading ? 'Reading your menu…' : 'Extract items'}</button>
          </div>
        </section>
        <aside className="panel aside-card">
          <h3>A small step, made simple.</h3>
          <p>Your menu stays yours. Check the draft, make it sound like your shop, and publish when it feels right.</p>
          <div className="steps">
            <div className="step-row"><span className="step-number">1</span><span>Share what’s already on your menu</span></div>
            <div className="step-row"><span className="step-number">2</span><span>Review names, prices, and details</span></div>
            <div className="step-row"><span className="step-number">3</span><span>See your neighborhood storefront</span></div>
          </div>
        </aside>
      </div>
    </main>}

    {screen === 'review' && <main className="page">
      <div className="review-head">
        <div><div className="eyebrow">Merchant setup · Step 2 of 3</div><h2>Review your menu draft</h2><p className="lede">A quick look from you makes this storefront feel like your shop.</p></div>
        <button className="text-button" onClick={() => setScreen('upload')}>← Back to menu input</button>
      </div>
      <div className="review-banner" role="note">Review before publishing — nothing goes live until you approve.</div>
      <div className="review-layout">
        <aside className="source-sticky">
          <div className="source-preview">
            <div className="source-preview-title">Your original menu</div>
            {draftSample && <MenuSource sample={draftSample} />}
            <p className="helper" style={{ margin: '12px 0 0' }}>{draftSample?.label} · Compare the draft with your source.</p>
          </div>
        </aside>
        <section className="review-main">
          <div className="shop-name-field"><label htmlFor="shop-name">Shop name</label><input id="shop-name" value={shopName} onChange={(event) => setShopName(event.target.value)} /></div>
          <p className="count-label">{items.length} items found — compare with your menu</p>
          <div className="review-tip"><span aria-hidden="true">i</span><span>Yellow fields need a closer look. Edit the field or confirm it when it matches your menu. Descriptions are AI drafts for you to review.</span></div>
          <div className="table-wrap">
            <table className="menu-table">
              <thead><tr><th scope="col">Name</th><th scope="col">Price</th><th scope="col">Category</th><th scope="col">Description</th><th scope="col">Remove</th></tr></thead>
              <tbody>{items.map((entry) => <tr key={entry.id}>
                <td>{renderField(entry, 'name')}</td>
                <td>{renderField(entry, 'price')}</td>
                <td>{renderField(entry, 'category')}</td>
                <td>{renderField(entry, 'description')}</td>
                <td><button className="row-delete" aria-label={`Delete ${entry.name || 'new item'}`} onClick={() => deleteItem(entry.id)}>Delete</button></td>
              </tr>)}</tbody>
            </table>
            {items.length === 0 && <div className="empty-items">No menu items yet. Add an item to get started.</div>}
          </div>
          <div className="review-actions">
            <div className="action-group"><button className="secondary-button" onClick={addItem}>＋ Add item</button><button className="text-button" onClick={reset}>Discard draft</button></div>
            <button className="primary-button" disabled={unresolved > 0 || !shopName.trim() || items.length === 0} onClick={() => setScreen('store')}>Approve &amp; publish</button>
          </div>
          {unresolved > 0 && <div className="disabled-note" role="status">{unresolved} field{unresolved === 1 ? '' : 's'} still need your review before you can publish.</div>}
        </section>
      </div>
    </main>}

    {screen === 'store' && <main className="page">
      <div className="review-head">
        <div><div className="eyebrow">Merchant setup · Step 3 of 3</div><h2>Your storefront is ready</h2><p className="lede">Here’s how your menu will look to your neighborhood.</p></div>
      </div>
      <section className="storefront" aria-label={`${shopName} storefront`}>
        <div className="store-hero"><div className="store-kicker">A neighborhood favorite</div><div className="store-title">{shopName}</div><span className="local-badge"><span className="banner-dot" />Locally owned</span></div>
        <div className="store-body">
          {Array.from(new Set(items.map((entry) => entry.category.trim() || 'Menu'))).map((category) => <section className="category-section" key={category}>
            <h3 className="category-title">{category}</h3>
            {items.filter((entry) => (entry.category.trim() || 'Menu') === category).map((entry) => <article className="store-item" key={entry.id}>
              <div className="store-item-name">{entry.name || 'Untitled item'}</div><div className="store-item-price">{entry.price.trim() ? (entry.price.trim().startsWith('$') ? entry.price : `$${entry.price}`) : 'Price to be confirmed'}</div>
              {entry.description && <div className="store-item-description">{entry.description}</div>}
            </article>)}
          </section>)}
          <div className="store-actions"><span className="helper">Your approved menu is saved in this browser session.</span><button className="secondary-button" onClick={() => setScreen('review')}>Back to edit</button></div>
        </div>
        <div className="store-foot">A local shop, shared with the neighborhood.</div>
      </section>
    </main>}
  </div>;
}

export default App;

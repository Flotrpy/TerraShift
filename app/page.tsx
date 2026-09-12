import Link from 'next/link';

export default function Home() {
  return <>
    <section className="hero container">
      <div className="hero-content">
        <div className="eyebrow">Sentinel-2 / EuroSAT / transfer learning</div>
        <h1 className="display">Read the land.<br /><em>See the shift.</em></h1>
        <p className="lede">TerraShift is a student research project testing how transfer learning can classify land-cover types from satellite imagery, and how those classifications might support future change analysis.</p>
        <div className="button-row"><Link className="button" href="/dataset-library">Explore the library <span>↗</span></Link><Link className="button secondary" href="/results">View research results <span>→</span></Link></div>
        <div className="hero-note"><span>01</span> A transparent research interface for a question that starts with pixels.</div>
      </div>
    </section>
    <section className="section container"><div className="section-header"><div><div className="eyebrow">What TerraShift does</div><h2 className="section-title">A clear path from image<br />to evidence.</h2></div><p className="section-copy">The project keeps classification, evaluation, and future change detection distinct so each claim stays grounded in the data behind it.</p></div><div className="home-grid"><div className="feature"><span className="feature-number">01 / DATA</span><h3>Browse the source material</h3><p>Explore EuroSAT classes and sample imagery when the collection is connected to the site.</p></div><div className="feature"><span className="feature-number">02 / MODEL</span><h3>Test a real image</h3><p>Upload RGB imagery for experimental inference through a separate model API.</p></div><div className="feature"><span className="feature-number">03 / RESEARCH</span><h3>Read the comparison</h3><p>Follow the current RGB and multispectral results, figures, limitations, and next steps.</p></div></div></section>
    <section className="band"><div className="section container"><div className="section-header"><div><div className="eyebrow">Current experiment</div><h2 className="section-title">RGB leads this<br />configuration.</h2></div><p className="section-copy" style={{color:'#aebfba'}}>The measured result is specific to the present setup. It is not a universal claim about RGB versus multispectral imagery.</p></div><div className="metric-grid"><div className="metric"><div className="metric-value">93.48%</div><div className="metric-label">RGB test accuracy</div></div><div className="metric"><div className="metric-value">85.93%</div><div className="metric-label">Multispectral test accuracy</div></div><div className="metric"><div className="metric-value">7.55 pt</div><div className="metric-label">Current gap</div></div></div></div></section>
  </>;
}
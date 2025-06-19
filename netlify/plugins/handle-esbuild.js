// netlify/plugins/handle-esbuild.js
module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('Handling esbuild version for Netlify build...');
    try {
      // Install the specific esbuild version that Netlify expects
      await utils.run.command('npm install esbuild@0.25.5 --no-save');
      console.log('Successfully installed esbuild@0.25.5');
    } catch (error) {
      console.error('Error installing esbuild:', error);
      // Don't fail the build if this doesn't work
      utils.build.failPlugin('Failed to install esbuild', { error });
    }
  }
};

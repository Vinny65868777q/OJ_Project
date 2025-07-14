const mongoose = require('mongoose');

/*Test-case sub-schema (embedded) */
const testCaseSchema = new mongoose.Schema(
  {
    input:          { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isSample:       { type: Boolean, default: false }   // true → visible
  },
  
);

/* Problem sub-schema (embedded)*/
const embeddedProblemSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, maxlength: 120 },
    description:  { type: String, required: true },
    inputFormat:  { type: String, required: true },
    outputFormat: { type: String, required: true },
    difficulty:   { type: String,
                    enum: ['easy','medium','difficult'],
                    default: 'medium' },
    testCases:    [testCaseSchema]
  },
  
);

/*  Contest schema  */
const contestSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: '' },

  /* Array of brand-new problems, each with its own testCases */
  problems:    [embeddedProblemSchema],

  startAt:     { type: Date, required: true },
  endAt:       { type: Date, required: true },
  

  createdBy:   { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  participants:[{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

contestSchema.index({ startAt: 1 });

module.exports = mongoose.model('Contest', contestSchema);

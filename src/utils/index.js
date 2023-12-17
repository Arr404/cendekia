const mapDBToModel = ({
  id,
  userId,
  pilih,
  createdAt,
}) => ({
  id,
  userId,
  pilih,
  created_at: createdAt,
});

module.exports = { mapDBToModel };

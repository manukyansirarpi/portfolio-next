'use client';

import React, { useEffect, useState } from 'react';
import { apiRoutes, authenticatedPostRequest } from '@/utils/api';
import { downloadStringAsHtmlFile } from '@/utils/download-file';
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { toast } from 'sonner';

import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import DocumentsDetail from '@/components/documents/documents-detail';
import Generated from '@/components/documents/generated';
import NotGenerated from '@/components/documents/not-generated';
import Published from '@/components/documents/published';
import BasePageDocuments from '@/components/page/base-page-documents';
import { FileIcon } from '@/components/uploader/file-icon';
import { Uploader } from '@/components/uploader/uploader';

const supabase = createClient();

function DocumentsTable() {
  const [documents, setDocuments] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('document_name');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState();

  const [showUploader, setShowUploader] = useState(false);

  const { user } = useUser();

  supabase
    .channel('documents')
    .on(
      'postgres_changes',
      {
        event: 'update',
        schema: 'public',
        table: 'documents',
      },
      (payload) => {
        documents.forEach((document, index) => {
          const newDocId = payload.new.id;
          const isExistingDoc = document.id === newDocId;

          if (isExistingDoc) {
            const documentsCopy = [...documents];
            documentsCopy[index] = payload.new;
            setDocuments(documentsCopy);
          }
        });

        if (!documents.some((doc) => doc.id === payload.new.id) && documents.length < rowsPerPage) {
          const documentsCopy = [...documents, payload.new];
          setDocuments(documentsCopy);
        }
      }
    )
    .subscribe();

  useEffect(() => {
    fetchCounts();
    fetchDocuments();
  }, [orderBy, orderDirection, page, rowsPerPage, search, user.organizationId, isGenerated, isPublished, isArchived]);

  const [generatedCount, setGeneratedCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);

  const fetchCounts = async () => {
    const generatedResponse = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .eq('organization_id', user.organizationId)
      .eq('is_generated', true);
    setGeneratedCount(generatedResponse.count);

    const publishedResponse = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .eq('organization_id', user.organizationId)
      .eq('is_published', true);
    setPublishedCount(publishedResponse.count);

    const archivedResponse = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .eq('organization_id', user.organizationId)
      .eq('is_archived', true);
    setArchivedCount(archivedResponse.count);
  };

  const fetchDocuments = async () => {
    const from = page * rowsPerPage;
    const to = from + rowsPerPage - 1;

    const query = supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('organization_id', user.organizationId)
      .ilike('document_name', `%${search}%`)
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);

    if (isGenerated) {
      query.filter('is_generated', 'is', true);
    }
    if (isPublished) {
      query.filter('is_published', 'is', true);
    }
    if (isArchived) {
      query.filter('is_archived', 'is', true);
    } else {
      query.filter('is_archived', 'is', false);
    }
    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
    } else {
      setDocuments(data);
      setTotalDocuments(count);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProductCodeBlur = async (id, newValue, oldValue) => {
    if (newValue !== oldValue) {
      const { error } = await supabase.from('documents').update({ product_code: newValue }).eq('id', id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`Productcode gewijzigd naar: ${newValue}`);
      }
    }
  };

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedRecords((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedRecords((prevSelected) => prevSelected.filter((recordId) => recordId !== id));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRecords(documents.map((document) => document.id));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleOpen = (id) => {
    setSelectedDocumentId(id);
    setShowDetailView(true);
  };

  const handleUploader = () => {
    setShowUploader(true);
  };

  const isRecordSelected = (id) => selectedRecords.includes(id);

  if (showUploader && !showDetailView) {
    return <Uploader setShowUploader={setShowUploader} />;
  }

  if (showDetailView && selectedDocumentId) {
    return (
      <DocumentsDetail documentId={selectedDocumentId} documents={documents} setShowDetailView={setShowDetailView} />
    );
  }

  const toggleIsGenerated = () => {
    setIsGenerated(!isGenerated);
  };

  const toggleIsPublished = () => {
    setIsPublished(!isPublished);
  };
  const toggleIsArchived = () => {
    setIsArchived(!isArchived);
  };

  return (
    <BasePageDocuments
      archivedCount={archivedCount}
      generatedCount={generatedCount}
      isArchived={isArchived}
      isGenerated={isGenerated}
      isPublished={isPublished}
      publishedCount={publishedCount}
      subtitle="Upload bestanden om productbeschrijvingen te genereren of bij te werken."
      title="Productbeschrijvingen"
      toggleIsArchived={toggleIsArchived}
      toggleIsGenerated={toggleIsGenerated}
      toggleIsPublished={toggleIsPublished}
    >
      <Paper>
        <Stack direction="row" justifyContent="space-between" margin={2} spacing={2}>
          <SearchDocument setSearch={setSearch} />
          <Button
            color="primary"
            onClick={handleUploader}
            startIcon={<img alt="file" height="25" src="/assets/icon-file.svg" width="25" />}
            type="button"
            variant="contained"
          >
            Upload
          </Button>
        </Stack>
        <TableContainer sx={{ height: '65vh' }}>
          <Table aria-label="Productbeschrijvingen">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    // checked={isSelected}
                    color="primary"
                    onChange={(event) => handleSelectAll(event)}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'document_name'}
                    direction={orderDirection}
                    onClick={() => handleRequestSort('document_name')}
                  >
                    Productbeschrijving
                  </TableSortLabel>
                </TableCell>
                <TableCell>Productcode</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Bronbestand</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'updated_at'}
                    direction={orderDirection}
                    onClick={() => handleRequestSort('updated_at')}
                  >
                    Laatst Gewijzigd
                  </TableSortLabel>
                </TableCell>
                <TableCell>Open</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ overflowY: 'auto' }}>
              {documents.map((doc) => {
                const isSelected = isRecordSelected(doc.id);
                return (
                  <TableRow key={doc.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        color="primary"
                        onChange={(event) => handleCheckboxChange(event, doc.id)}
                      />
                    </TableCell>

                    <TableCell>{doc.document_name}</TableCell>
                    <TableCell>
                      <TextField
                        defaultValue={doc.product_code}
                        onBlur={(e) => handleProductCodeBlur(doc.id, e.target.value, doc.product_code)}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {doc?.is_processing ? (
                        <CircularProgress color="primary" size="2rem" />
                      ) : (
                        <>
                          {doc?.is_generated && doc?.is_published ? <Published /> : null}
                          {doc?.is_generated && !doc?.is_published ? <Generated /> : null}
                          {!doc?.is_generated && !doc?.is_published && <NotGenerated />}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <FileIcon extension={doc.document_name.split('.').pop()} />
                    </TableCell>
                    <TableCell>{new Date(doc.updated_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(doc.id)}>
                        <img alt="open" height="30" src="/assets/icon-open.svg" width="30" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalDocuments}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} van de ${count !== -1 ? count : `meer dan ${to}`}`
          }
          labelRowsPerPage="Rijen per pagina:"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      {selectedRecords.length > 0 && <Actions documents={selectedRecords} fetchDocuments={fetchDocuments} />}
    </BasePageDocuments>
  );
}

export default DocumentsTable;

function Actions({ documents, fetchDocuments }) {
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingRegenerate, setLoadingRegenerate] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);

  useEffect(() => {}, [documents]);

  const handleDownload = async () => {
    setLoadingDownload(true);
    const { data } = await supabase.from('documents').select('document_name, generated_content').in('id', documents);
    if (data) {
      data.forEach((document) => {
        downloadStringAsHtmlFile(document.generated_content, document.document_name);
      });
      toast.success('Bestanden zijn gedownload');
    } else {
      toast.error('Download mislukt');
    }
    setLoadingDownload(false);
  };

  const handleRegenerate = async () => {
    setLoadingRegenerate(true);
    const { data } = await supabase
      .from('documents')
      .select('document_name, generated_content, brand_id, organization_id')
      .in('id', documents);

    const documentNames = data.map(
      (document) => `${document.organization_id}/${document.brand_id}/product/${document.document_name}`
    );
    const response = await authenticatedPostRequest(apiRoutes.events.generate, { documents: documentNames });

    if (response.status === 201) {
      toast.success('Regenereren productbeschrijvingen gestart');
    } else {
      toast.error('Er is iets mis gegaan, probeer het later opnieuw');
    }
    setLoadingRegenerate(false);
  };

  const handlePublish = async () => {
    setLoadingDownload(true);
    toast.success('Productbeschrijvingen gepubliceerd');
    setLoadingPublish(false);
  };

  const handleArchive = async () => {
    setLoadingArchive(true);

    const { error } = await supabase.from('documents').update({ is_archived: true }).in('id', documents);

    if (!error) {
      fetchDocuments();
      toast.warning('Productbeschrijvingen zijn gearchiveerd');
    } else {
      toast.error('Er is iets mis gegaan, probeer het later opnieuw');
    }
    setLoadingArchive(false);
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        paddingTop: 3,
      }}
    >
      <Stack alignItems="center" direction="row" justifyContent="center" spacing={1}>
        <Button
          color="secondary"
          disabled={loadingDownload}
          onClick={handleDownload}
          startIcon={<img alt="spark" height="25" src="/assets/icon-download.svg" width="25" />}
          type="button"
          variant="outlined"
        >
          Download
          {loadingDownload ? <CircularProgress color="secondary" size="1rem" sx={{ marginLeft: 2 }} /> : null}
        </Button>
        <Button
          color="secondary"
          disabled={loadingRegenerate}
          onClick={handleRegenerate}
          startIcon={<img alt="spark" height="25" src="/assets/icon-refresh.svg" width="25" />}
          type="button"
          variant="outlined"
        >
          Regenereren
          {loadingRegenerate ? <CircularProgress color="secondary" size="1rem" sx={{ marginLeft: 2 }} /> : null}
        </Button>
        <Button
          color="secondary"
          disabled={loadingPublish || true}
          onClick={handlePublish}
          startIcon={<img alt="spark" height="25" src="/assets/icon-cloud.svg" width="25" />}
          type="button"
          variant="outlined"
        >
          Publiceren
          {loadingPublish ? <CircularProgress color="secondary" size="1rem" sx={{ marginLeft: 2 }} /> : null}
        </Button>
        <Button
          color="secondary"
          disabled={loadingArchive}
          onClick={handleArchive}
          startIcon={<img alt="spark" height="25" src="/assets/icon-trash.svg" width="25" />}
          type="button"
          variant="outlined"
        >
          Archiveren
          {loadingArchive ? <CircularProgress color="secondary" size="1rem" sx={{ marginLeft: 2 }} /> : null}
        </Button>
      </Stack>
    </Box>
  );
}

function SearchDocument({ setSearch }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchOptions = async () => {
      if (inputValue === '') {
        setOptions([]);
        return;
      }

      const { data, error } = await supabase
        .from('documents')
        .select('document_name')
        .ilike('document_name', `%${inputValue}%`)
        .limit(10);

      if (error) {
        return;
      }

      if (active) {
        setOptions(data.map((doc) => doc.document_name));
      }
    };

    fetchOptions();

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      disablePortal
      freeSolo
      onChange={(event, newValue) => {
        setSearch(newValue || ''); // Set to empty string if newValue is null
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        if (newInputValue === '') {
          setSearch('');
        }
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            disableUnderline: true, // Remove underline to match styles
          }}
          placeholder="Zoek bestandsnaam ..."
          variant="filled"
        />
      )}
      sx={{
        width: 375,
        '& .MuiFilledInput-root': {
          borderRadius: '50px',
          padding: '0px 12px',
        },
      }}
    />
  );
}
